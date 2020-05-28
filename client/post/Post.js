import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import CommentIcon from '@material-ui/icons/Comment';
import Divider from '@material-ui/core/Divider';

import { remove, like, unlike } from './api-post.js';
import Comments from './Comments';
import auth from './../auth/auth-helper';

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth:600,
        margin: 'auto',
        marginBottom: theme.spacing(3),
        backgroundColor: 'rgba(0, 0, 0, 0.06)'
    },
    cardContent: {
        backgroundColor: 'white',
        padding: `${theme.spacing(2)}px 0px`
    },
    cardHeader: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1)
    },
    text: {
        margin: theme.spacing(2)
    },
    photo: {
        textAlign: 'center',
        backgroundColor: '#f2f5f4',
        padding:theme.spacing(1)
    },
    media: {
        height: 200
    },
    button: {
        margin: theme.spacing(1),
    }
}))

export default function Post ({ post, onRemove }){
    const classes = useStyles();
    const jwt = auth.isAuthenticated();

    const checkLike = likes => {
        return likes.indexOf(jwt.user._id) !== -1;
    }

    const [values, setValues] = useState({
        like: checkLike(post.likes),
        likes: post.likes.length,
        comments: post.comments
    })

    // useEffect(() => {
    //   setValues({...values, like:checkLike(props.post.likes), likes: props.post.likes.length, comments: props.post.comments})
    // }, [])

    const clickLike = () => {
        const callApi = values.like ? unlike : like;

        callApi(
            {userId: jwt.user._id},
            {t: jwt.token},
            post._id
        ).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setValues({
                    ...values,
                    like: !values.like,
                    likes: data.likes.length
                })
            }
        })
    }

    const updateComments = comments => {
        setValues({...values, comments});
    }

    const deletePost = () => {
        remove({postId: post._id}, {t: jwt.token})
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    onRemove(post);
                }
        });
    }

    return (
        <Card className={classes.card}>
            <CardHeader
                avatar={
                    <Avatar src={'/api/users/photo/'+post.postedBy._id}/>
                }
                action={post.postedBy._id === auth.isAuthenticated().user._id &&
                <IconButton onClick={deletePost}>
                    <DeleteIcon />
                </IconButton>
                }
                title={<Link to={"/user/" + post.postedBy._id}>{post.postedBy.name}</Link>}
                subheader={(new Date(post.created)).toDateString()}
                className={classes.cardHeader}
            />
            <CardContent className={classes.cardContent}>
                <Typography component="p" className={classes.text}>
                    {post.text}
                </Typography>
                {post.photo && (
                    <div className={classes.photo}>
                        <img
                            className={classes.media}
                            src={'/api/posts/photo/'+post._id}
                        />
                    </div>
                )}
            </CardContent>
            <CardActions>
                { values.like
                    ? <IconButton
                        onClick={clickLike}
                        className={classes.button}
                        aria-label="Like"
                        color="secondary"
                    >
                        <FavoriteIcon />
                    </IconButton>
                    : <IconButton
                        onClick={clickLike}
                        className={classes.button}
                        aria-label="Unlike"
                        color="secondary"
                    >
                        <FavoriteBorderIcon />
                    </IconButton>
                } <span>{values.likes}</span>
                <IconButton
                    className={classes.button}
                    aria-label="Comment"
                    color="secondary"
                >
                    <CommentIcon />
                </IconButton> <span>{values.comments.length}</span>
            </CardActions>
            <Divider/>
            <Comments postId={post._id} comments={values.comments} updateComments={updateComments}/>
        </Card>
    )

}

Post.propTypes = {
    post: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired
}
