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

const photo = (req, res, next) => {
    res.set("Content-Type", req.post.photo.contentType);

    return res.send(req.post.photo.data);
};

const postByID = async (req, res, next, id) => {
    try{
        const post = await Post.findById(id)
            .populate('postedBy', '_id name')
            .exec();

        if (!post)
            return res.status('400').json({
                error: "Post not found"
            });

        req.post = post;
        next();
    } catch(err){
        return res.status('400').json({
            error: "Could not retrieve use post"
        });
    }
};

const isPoster = (req, res, next) => {
    let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id;
    if (!isPoster) {
        return res.status('403').json({
            error: "User is not authorized"
        });
    }
    next();
};

const remove = async (req, res) => {
    const post = req.post;
    try {
        const deletedPost = post.remove();
        res.json(deletedPost);
    } catch(err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        });
    }
};

export default {
    listNewsFeed,
    listByUser,
    create,
    photo,
    postByID,
    isPoster
}
