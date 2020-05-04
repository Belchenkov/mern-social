import extend from 'lodash/extend';
import formidable from 'formidable';
import fs from 'fs';

import User from '../models/user.model';
import errorHandler from './../helpers/dbErrorHandler';

const create = async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        return res.status(200).json({
            message: "Successfully signed up!"
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
};

const list = async (req, res) => {
    try {
        let users = await User.find().select('name email updated created');

        res.json(users);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
}

/**
 * Load user and append to req.
 */
const userByID = async (req, res, next, id) => {
    try {
        let user = await User.findById(id);

        if (!user)
            return res.status('400').json({
                error: "User not found"
            })
        req.profile = user;
        next();
    } catch (err) {
        return res.status('400').json({
            error: "Could not retrieve user"
        });
    }
}


const read = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;

    return res.json(req.profile);
};

const update = async (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Photo could not be uploaded"
            })
        }

        let user = req.profile;

        user = extend(user, req.body);
        user.updated = Date.now();

        if (files.photo){
            user.photo.data = fs.readFileSync(files.photo.path);
            user.photo.contentType = files.photo.type;
        }

        try {
            await user.save();

            user.hashed_password = undefined;
            user.salt = undefined;

            res.json(user);
        } catch (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
    });


}

const remove = async (req, res) => {
    try {
        let user = req.profile;
        let deletedUser = await user.remove();

        deletedUser.hashed_password = undefined;
        deletedUser.salt = undefined;

        res.json(deletedUser);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
}

export default { create, userByID, read, list, remove, update }
