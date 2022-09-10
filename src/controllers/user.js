import User from '../models/User'
import {
  accountActivationEmail,
  sendForgotPassword,
  gravatar,
  sendNewUserEmail,
} from '../middleware/utils'
import shortId from 'shortid'
import mongoError from '../middleware/mongoErrors'
import jwt from 'jsonwebtoken'
import {OAuth2Client} from 'google-auth-library'
import {
  validateEmail,
  validatePassword,
  validateRequired,
} from '../middleware/validate'
import Settings from '../models/Settings'

const passwordResetSecrete = process.env.JWT_PASSWORD_SECRET
const userActivationSecret = process.env.JWT_ACCOUNT_ACTIVATION
const sessionExpiration = process.env.SESSION_EXPIRES

/**
 * User controller - Class
 * @category Api
 */
class UserController {
  // prepare email verification token
  async accountActivation(ctx) {
    const {name, email, password} = ctx.request.body
    const emailValid = validateEmail(email)
    const passwordValid = validatePassword(password)
    const nameValid = validateRequired(name)

    if (!emailValid || !passwordValid || !nameValid) {
      ctx.throw(422, 'Invalid data received')
    }

    try {
      const user = await User.exists({email})
      if (user) {
        ctx.throw(422, 'An active account already exist.')
      }
      const token = await jwt.sign(
        {name, email, password},
        userActivationSecret,
        {expiresIn: '60m'}
      )
      ctx.body = {
        status: 200,
        message: `An email has been sent to ${email}. Please validate to activate account.`,
      }
      return await accountActivationEmail(email, token)
    } catch (err) {
      ctx.throw(422, err)
    }
  }

  // Complete the registration and notify admin of new user
  async register(ctx) {
    const {token} = ctx.request.body
    await jwt.verify(token, userActivationSecret, async function (
      err,
      decoded
    ) {
      if (err) {
        ctx.throw(401, {
          message: 'Link is expired. Please signup again.',
        })
      }
      const {name, email, password} = decoded
      const avatar = gravatar(email)
      const username = shortId.generate()
      const obj = {
        name,
        email,
        password,
        avatar,
        username,
        emailVerificationToken: undefined,
        emailVerified: true,
      }
      const user = new User(obj)

      try {
        const result = await user.save()
        if (result) {
          // Here we check if admin wants to be notify when a new user is created
          // TODO refactor the notification settings checked.
          let newUser = false
          let settings = await Settings.find()
          for (const element of settings) {
            newUser = element.newUser
          }
          if (newUser) {
            await sendNewUserEmail(name, email)
          }
          ctx.body = {
            status: 200,
            message: 'Account is now active. Please login.',
          }
        }
      } catch (err) {
        ctx.throw(422, err)
      }
    })
  }

  async login(ctx) {
    const {password, email} = ctx.request.body
    const passwordValid = validatePassword(password)
    const emailValid = validateEmail(email)
    if (!passwordValid || !emailValid) {
      ctx.throw(422, 'Invalid data received')
    }

    try {
      let user = await User.findOne({email: email})
      if (!user) {
        ctx.throw(404, 'User not found.')
      }
      if (!(await user.comparePassword(password))) {
        ctx.throw(422, {message: 'Password is invalid'})
      }
      const authUser = user.toAuthJSON()
      ctx.cookies.set('token', authUser.token, {
        expiresIn: sessionExpiration,
        sameSite: 'lax',
        httpOnly: true,
      })
      return ctx.body = authUser
    } catch (error) {
      ctx.throw(422, error)
    }
  }

  async googleLogin(ctx) {
    const idToken = ctx.request.body.idToken
    const googleId = process.env.GOOGLE_ID
    const client = new OAuth2Client(googleId)
    try {
      const res = await client.verifyIdToken({
        idToken,
        audience: googleId,
      })
      if (!res) {
        ctx.throw(422, 'Google authentication failed. Try again.')
      }
      const {email_verified, name, email, at_hash} = res.getPayload()
      if (!email_verified) {
        ctx.throw(422, 'You have not verify this google email.')
      }
      const user = await User.findOne({email})
      if (user) {
        const authUser = await user.toAuthJSON()
        await ctx.cookies.set('token', authUser.token, {
          expiresIn: sessionExpiration,
          sameSite: 'lax',
          httpOnly: true,
        })
        return (ctx.body = authUser)
      } else {
        const avatar = await gravatar(email)
        const username = await shortId.generate()
        const password = at_hash + process.env.GOOGLE_AUTH_PASSWORD_EXT
        const user = new User({
          name,
          email,
          username,
          password,
          avatar,
        })
        const googleUser = await user.save()
        const googleAuthUser = await googleUser.toAuthJSON()
        ctx.cookies.set('token', googleAuthUser.token, {
          expiresIn: sessionExpiration,
          sameSite: 'lax',
          httpOnly: true,
        })
        ctx.body = googleAuthUser
      }
    } catch (err) {
      ctx.throw(422, err)
    }
  }

  async logOut(ctx) {
    ctx.state.user = null
    ctx.cookies.set('token', null)
    ctx.body = {status: 200, message: 'Success!'}
  }

  async forgot(ctx) {
    const data = ctx.request.body
    const emailValid = validateEmail(data.email)
    if (!emailValid || !data.email) {
      ctx.throw(422, 'Email format is invalid')
    }
    const exist = await User.exists({email: data.email})
    // If the email does not exist, we send a generic message. No further action is taken.
    if (!exist) {
      ctx.throw(200, {
        message:
          'If an account is found, you will receive an email with reset password instructions.',
      })
    }

    try {
      const token = jwt.sign({}, passwordResetSecrete, {
        expiresIn: '30m',
      })
      let resetData = {
        passwordResetToken: token,
      }
      const user = await User.findOneAndUpdate(
        {email: data.email},
        resetData,
        {returnOriginal: false}
      )
      if (!user) {
        ctx.throw(422, 'Email not found.')
      }

      await sendForgotPassword(user.email, token)
      ctx.body = {status: 200, message: `Email sent to ${user.email}`}
    } catch (err) {
      if (err.code === 401) {
        ctx.throw(
          'Oops! something is not right. We are having issues sending your inquiry'
        )
      }
      ctx.throw(err.code || 422, err)
    }
  }

  async resetPassword(ctx) {
    const {passwordResetToken, password} = ctx.request.body
    const passwordValid = validatePassword(password)
    if (!passwordValid) {
      ctx.throw(
        422,
        'Password minimum length 8, must have 1 capital letter, 1 number and 1 special character.'
      )
    }

    await jwt.verify(
      passwordResetToken,
      passwordResetSecrete,
      async function (err) {
        if (err) {
          ctx.throw(
            401,
            'Expired or invalid link! Please try to resetting your password again'
          )
        }
        try {
          let user = await User.findOne({
            passwordResetToken: passwordResetToken,
          })
          if (!user) {
            ctx.throw(
              422,
              'Password reset token is invalid or has expired.'
            )
          }
          user.password = password
          user.passwordResetToken = undefined

          const res = await user.save()
          if (res) {
            ctx.body = {
              status: 200,
              message: 'Password was updated successfully.',
            }
          }
        } catch (err) {
          ctx.throw(422, err)
        }
      }
    )
  }

  async updatePassword(ctx) {
    const {_id, password} = ctx.request.body
    try {
      const user = await User.findOne({_id: _id})
      if (user) {
        user.password = password
        const res = await user.save()
        if (!res) {
          ctx.throw(
            422,
            'Oops something went wrong, please try again.'
          )
        }
        ctx.body = {status: 200, message: 'Password was updated.'}
      }
    } catch (err) {
      ctx.throw(422, mongoError(err))
    }
  }

  // if user is authorise sends the user data
  async account(ctx) {
    ctx.body = ctx.state.user
  }

  async getProfile(ctx) {
    try {
      return (ctx.body = await User.findOne({
        username: ctx.params.username,
      }).select(
        'username name email about website role location gender avatar createdAt'
      ))
    } catch (err) {
      ctx.throw(422, err)
    }
  }

  async updateUserName(ctx) {
    let username = ctx.params.username
    let exits = await User.exists({username: username})
    if (!exits) ctx.throw(404, 'User not found')
    try {
      let user = await User.findOneAndUpdate(
        {username: username},
        username,
        {new: true, runValidators: true, context: 'query'}
      )
      ctx.body = user.toAuthJSON()
    } catch (err) {
      ctx.throw(422, err)
    }
  }

  async updateAccount(ctx) {
    const body = ctx.request.body
    if (body.username) {
      body.username.replace(/\s/g, '')
    }
    try {
      let exist = await User.exists({username: body.username})
      if (exist) {
        ctx.throw(422, 'Username already exist, please choose another')
      }
      let user = await User.findOneAndUpdate(
        {username: ctx.params.username},
        body,
        {
          new: true,
          runValidators: true,
          context: 'query',
        }
      )
      if (!user) {
        ctx.throw(404, 'User not found')
      }
      ctx.body = user.toAuthJSON()
    } catch (err) {
      ctx.throw(422, err)
    }
  }

  async deleteUser(ctx) {
    try {
      const userId = ctx.request.body._id
      const deleteUser = await User.deleteOne({_id: userId})
      if (!deleteUser) {
        ctx.throw(422, 'Oops something went wrong, please try again.')
      }
      ctx.state.user = null
      ctx.cookies.set('token', null)
      ctx.body = {status: 200, message: 'Success!'}

    } catch (err) {
      ctx.throw(422, err)
    }
  }

  // ADMIN USER CONTROLLER
  async adminGetUsers(ctx) {
    const perPage = 2
    const page = ctx.params.page || 1
    try {
      const users = await User.find({})
        .select('-password')
        .skip(perPage * page - perPage)
        .limit(perPage)
      const totalItems = await User.countDocuments({})
      return (ctx.body = {
        totalItems: totalItems,
        perPage: perPage,
        users: users,
      })
    } catch (err) {
      ctx.throw(422, err)
    }
  }

  async adminGetUser(ctx) {
    try {
      return (ctx.body = await User.findById({
        _id: ctx.params.id,
      }).select({
        profile: 1,
        email: 1,
        role: 1,
        avatar: 1,
        createdAt: 1,
        username: 1,
        about: 1,
        name: 1,
      }))
    } catch (err) {
      ctx.throw(err)
    }
  }

  async getStats(ctx) {
    try {
      return (ctx.body = await User.countDocuments({}))
    } catch (err) {
      ctx.throw(422, err)
    }
  }

  // public user
  async publicProfile(ctx) {
    try {
      const user = await User.findOne({
        username: ctx.params.username,
      }).select('_id username name email avatar createdAt')

      const blogs = await Blog.find({postedBy: user._id})
        .populate('categories', 'name slug')
        .populate('tags', 'name slug')
        .populate('postedBy', 'id name')
        .select(
          'title slug excerpt categories avatar tags postedBy createdAt'
        )

      return (ctx.body = {user, blogs})
    } catch (err) {
      ctx.throw(422, err)
    }
  }
}

export default UserController
