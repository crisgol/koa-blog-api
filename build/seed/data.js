"use strict";

var mongoose = require('mongoose');

var user1 = mongoose.Types.ObjectId();
var user2 = mongoose.Types.ObjectId();
var user3 = mongoose.Types.ObjectId();
var user4 = mongoose.Types.ObjectId();
var user5 = mongoose.Types.ObjectId();
var user6 = mongoose.Types.ObjectId();
var user7 = mongoose.Types.ObjectId();
var user8 = mongoose.Types.ObjectId();
var user9 = mongoose.Types.ObjectId();
var user10 = mongoose.Types.ObjectId();
var user11 = mongoose.Types.ObjectId();
var user12 = mongoose.Types.ObjectId();
var user13 = mongoose.Types.ObjectId();
var user14 = mongoose.Types.ObjectId();
var user15 = mongoose.Types.ObjectId();
var user16 = mongoose.Types.ObjectId();
var user17 = mongoose.Types.ObjectId();
var user18 = mongoose.Types.ObjectId();
var user19 = mongoose.Types.ObjectId();
var user20 = mongoose.Types.ObjectId();
/**
 * Random number generator fuction
 * @returns {number}
 *
 */

module.exports = {
  users: [{
    _id: user1,
    email: 'me@me.com',
    avatar: 'https://picsum.photos/id/237/200',
    password: 'Password#1',
    role: 'admin',
    about: 'about me...',
    name: 'David',
    location: 'Santa Ana, CA',
    gender: 'Male',
    website: ''
  }, {
    _id: user2,
    email: 'me2@me.com',
    avatar: 'https://picsum.photos/id/237/200',
    password: 'Password#1',
    role: 'user',
    name: 'Jose',
    about: 'about me...',
    location: 'Nebraska',
    gender: 'Male',
    website: ''
  }, {
    _id: user3,
    email: 'me3@me.com',
    avatar: 'https://picsum.photos/id/237/200',
    password: 'Password#1',
    role: 'user',
    name: 'Maria',
    about: 'about me...',
    location: 'Alaska',
    gender: 'Female',
    website: ''
  }, {
    _id: user4,
    email: 'me4@me.com',
    avatar: 'https://picsum.photos/id/237/200',
    password: 'Password#1',
    role: 'user',
    name: 'Tina Turner',
    about: 'about me...',
    location: 'Hacienda',
    gender: 'Female',
    website: ''
  }, {
    _id: user5,
    email: 'me5@me.com',
    avatar: 'https://picsum.photos/id/237/200',
    password: 'Password#1',
    role: 'user',
    name: 'Henry Carpio',
    about: 'about me...',
    location: 'Adromenda',
    gender: 'Male',
    website: ''
  }, {
    _id: user6,
    email: 'me6@me.com',
    avatar: 'https://picsum.photos/id/237/200',
    password: 'Password#1',
    role: 'user',
    name: 'Lincoln Abraham',
    about: 'about me...',
    location: 'Neptun',
    gender: 'Male',
    website: ''
  }, {
    _id: user7,
    email: 'me7@me.com',
    avatar: 'https://picsum.photos/id/237/200',
    password: 'Password#1',
    role: 'user',
    name: 'Americo',
    about: 'about me...',
    location: 'Jupiter',
    gender: 'Female',
    website: ''
  }, {
    _id: user8,
    email: 'me8@me.com',
    avatar: 'https://picsum.photos/id/237/200',
    password: 'Password#1',
    role: 'user',
    name: 'Fernando Valenzuela',
    about: 'about me...',
    location: 'Moon',
    gender: 'Male',
    website: ''
  }, {
    _id: user9,
    email: 'me9@me.com',
    avatar: 'https://picsum.photos/id/237/200',
    password: 'Password#1',
    role: 'user',
    name: 'Jeff Bundy',
    about: 'about me...',
    location: 'Mars',
    gender: 'Male',
    website: ''
  }, {
    _id: user10,
    email: 'me10@me.com',
    avatar: 'https://picsum.photos/id/237/200',
    password: 'Password#1',
    role: 'user',
    name: 'Irlanda Croesia',
    about: 'about me...',
    location: 'Sinaloa, MX',
    gender: 'Female',
    website: ''
  }, {
    _id: user11,
    email: 'me11@me.com',
    avatar: 'https://picsum.photos/id/237/200',
    password: 'Password#1',
    role: 'user',
    name: 'Rafael Don Part',
    about: 'about me...',
    location: 'Las Vegas, NV',
    gender: 'Male',
    website: ''
  }, {
    _id: user12,
    email: 'me12@me.com',
    avatar: 'https://picsum.photos/id/237/200',
    password: 'Password#1',
    role: 'user',
    name: 'Ana Lima Peru',
    about: 'about me...',
    location: 'Santa Cruz',
    gender: 'Female',
    website: ''
  }, {
    _id: user13,
    email: 'me13@me.com',
    avatar: 'https://picsum.photos/id/237/200',
    password: 'Password#1',
    role: 'user',
    name: 'Flor Luz',
    about: 'about me...',
    location: 'Saint Georgia',
    gender: 'Female',
    website: ''
  }, {
    _id: user14,
    email: 'me14@me.com',
    avatar: 'https://picsum.photos/id/237/200',
    password: 'Password#1',
    role: 'user',
    name: 'Timmoty MaCbay',
    about: 'about me...',
    location: 'San Fernando',
    gender: 'Male',
    website: ''
  }, {
    _id: user15,
    email: 'me15@me.com',
    avatar: 'https://picsum.photos/id/237/200',
    password: 'Password#1',
    role: 'user',
    name: 'Anastasia',
    about: 'about me...',
    location: 'San Isidro',
    gender: 'Female',
    website: ''
  }, {
    _id: user16,
    email: 'me16@me.com',
    avatar: 'https://picsum.photos/id/237/200',
    password: 'Password#1',
    role: 'user',
    name: 'Naomi Ferguson',
    about: 'about me...',
    location: 'San Jose',
    gender: 'Female',
    website: ''
  }, {
    _id: user17,
    email: 'me17@me.com',
    avatar: 'https://picsum.photos/id/237/200',
    password: 'Password#1',
    role: 'user',
    name: 'Tempi Arizona',
    about: 'about me...',
    location: 'Santa Barbara',
    gender: 'Male',
    website: ''
  }, {
    _id: user18,
    email: 'me18@me.com',
    avatar: 'https://picsum.photos/id/237/200',
    password: 'Password#1',
    role: 'user',
    name: 'Julieta Romeo',
    about: 'about me...',
    location: 'Washington',
    gender: 'Female',
    website: ''
  }, {
    _id: user19,
    email: 'me19@me.com',
    avatar: 'https://picsum.photos/id/237/200',
    password: 'Password#1',
    role: 'user',
    name: 'Jen Jhonson',
    about: 'about me...',
    location: 'Santa Monica, CA',
    gender: 'Female',
    website: ''
  }, {
    _id: user20,
    email: 'me20@me.com',
    avatar: 'https://picsum.photos/id/237/200',
    password: 'Password#1',
    role: 'user',
    name: 'Susan Lyn',
    about: 'about me...',
    location: 'Seattle',
    gender: 'Female',
    website: ''
  }]
};