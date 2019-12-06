import { Router } from 'express';
import passport from 'passport';

import { login } from './controllers/auth';
import * as users from './controllers/users';
import * as investigations from './controllers/investigations';
const userModel = require('../models/user');

const rootRouter = new Router();
rootRouter.post('/login', login);

rootRouter.post('/user', async (req, res) => {
    console.log(req.body);
    const user = new userModel(req.body);
    try {
      await user.save();
      res.send(user);
    } catch (err) {
      res.status(500).send(err);
    }
  });
  
rootRouter.get('/user', async (req, res) => {
    const users = await userModel.find({});
    try {
        res.send(users);
    } catch (err) {
        res.status(500).send(err);
    }
});
  

const apiRouter = new Router();
apiRouter.use(passport.authenticate('jwt', { session: false }));

const usersRouter = new Router();
usersRouter.get('/current', users.current);
apiRouter.use('/users', usersRouter);

const investigationsRouter = new Router();
investigationsRouter.get('/', investigations.get);
investigationsRouter.get('/:id', investigations.getSingle);
apiRouter.use('/investigations', investigationsRouter);

rootRouter.use('/api', apiRouter);

export default rootRouter;
