import express from 'express';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import cors from 'cors';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import mongoose from 'mongoose';

import rootRouter from './routes';
const userModel = require('./models/user');

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

// set up mongoose
mongoose.connect('mongodb://localhost/projectsupport')
  .then(()=> {
    console.log('Database connected');
  })
  .catch((error)=> {
    console.log('Error connecting to database');
  });

const mockUser = {
  id: 0,
  email: 'admin@admin.admin',
  username: 'gopi',
  password: 'gopi',
};

const userInfo = {
  id: 0,
  email: 'admin@admin.admin',
  username: 'gopi',
};

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  (email, password, done) => {
    // Here you can insert your own logic.
    // See examples here: http://www.passportjs.org/docs/downloads/html/#configure

    userModel.findOne({email:email, password: password}).then(user => {
      console.log(user);
      console.log(email);
      console.log(password);
      if(!user){
        return done(null, false, { message: 'User not found.' });
      }
      if (email !== user.email) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      if (password !== user.password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, {name:user.name, email: user.email});
    }).catch(err =>{
      return done(null, false, { message: err });
    });
   
  },
));

passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret',
  },
  (payload, done) => {
    // Here you can insert your own logic.
    if (payload.id !== mockUser.id) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    return done(null, mockUser);
  },
));

app.use(rootRouter);

const port = 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
