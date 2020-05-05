import express from 'express';
const router = express.Router();

import userCtrl from '../controllers/user.controller';
import authCtrl from '../controllers/auth.controller';

router.route('/api/users')
    .get(userCtrl.list)
    .post(userCtrl.create);

router.route('/api/users/:userId')
    .get(authCtrl.requireSignin, userCtrl.read)
    .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
    .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove);

router.param('userId', userCtrl.userByID);

router.route('/api/users/photo/:userId')
    .get(userCtrl.photo, userCtrl.defaultPhoto)
router.route('/api/users/defaultphoto')
    .get(userCtrl.defaultPhoto)

export default router;
