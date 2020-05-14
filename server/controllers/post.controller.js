import formidable from 'formidable';
import fs from 'fs';

import Post from '../models/post';
import errorHandler from './../helpers/dbErrorHandler';

const listNewsFeed = async (req, res) => {
    let following = req.profile.following;
    following.push(req.profile._id);

    try {
        let posts = await Post.find({
            postedBy: {
                $in : req.profile.following
            }})
            .populate('comments.postedBy', '_id name')
            .populate('postedBy', '_id name')
            .sort('-created')
            .exec();

        res.json(posts);
    } catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
};

const listByUser = async (req, res) => {
    try {
        const posts = await Post.find({
            postedBy: req.profile._id
        })
            .populate('comments.postedBy', '_id name')
            .populate('postedBy', '_id name')
            .sort('-created')
            .exec();
        res.json(posts);
    } catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
};

const create = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }
        let post = new Post(fields);
        post.postedBy= req.profile;

        if (files.photo){
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }

        try {
            let result = await post.save();

            res.json(result);
        } catch (err) {
            return res.status(400).json({
                error: errorHandler.getErrorMessage(err)
            });
        }
    })
};

export default {
    listNewsFeed,
    listByUser,
    create
}