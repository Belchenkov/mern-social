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


export default {
    listNewsFeed,
}