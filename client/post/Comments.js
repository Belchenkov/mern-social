import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CardHeader from '@material-ui/core/CardHeader';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import { comment, uncomment } from './api-post.js';
import auth from './../auth/auth-helper';

const useStyles = makeStyles(theme => ({
    cardHeader: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1)
    },
    smallAvatar: {
        width: 25,
        height: 25
    },
    commentField: {
        width: '96%'
    },
    commentText: {
        backgroundColor: 'white',
        padding: theme.spacing(1),
        margin: `2px ${theme.spacing(2)}px 2px 2px`
    },
    commentDate: {
        display: 'block',
        color: 'gray',
        fontSize: '0.8em'
    },
    commentDelete: {
        fontSize: '1.6em',
        verticalAlign: 'middle',
        cursor: 'pointer'
    }
}));

export default function Comments ({ updateComments, comments }) {
    const classes = useStyles();
    const [text, setText] = useState('');
    const jwt = auth.isAuthenticated();
    const handleChange = event => {
        setText(event.target.value);
    };

    const addComment = event => {
        if (event.keyCode === 13 && event.target.value) {
            event.preventDefault();

            comment(
                { userId: jwt.user._id },
                { t: jwt.token },
                props.postId,
                {text: text}
                ).then(data => {
                if (data.error) {
                    console.log(data.error);
                } else {
                    setText('');
                    updateComments(data.comments);
                }
            })
        }
    }

    const commentBody = item => {
        return (
            <p className={classes.commentText}>
                <Link to={"/user/" + item.postedBy._id}>
                    {item.postedBy.name}
                </Link><br/>
                { item.text }
                <span className={classes.commentDate}>
                    {
                        (new Date(item.created)).toDateString()} |
                        {auth.isAuthenticated().user._id === item.postedBy._id &&
                        <Icon onClick={deleteComment(item)} className={classes.commentDelete}>delete</Icon>
                    }
                </span>
            </p>
        )
    }

    return (<div>
        <CardHeader
            avatar={
                <Avatar
                    className={classes.smallAvatar}
                    src={'/api/users/photo/' + auth.isAuthenticated().user._id}
                />
            }
            title={
                <TextField
                    onKeyDown={addComment}
                    multiline
                    value={text}
                    onChange={handleChange}
                    placeholder="Write something ..."
                    className={classes.commentField}
                    margin="normal"
                />
            }
            className={classes.cardHeader}
        />
        {
            comments.map((item, i) => {
                return (
                    <CardHeader
                        avatar={
                            <Avatar
                                className={classes.smallAvatar}
                                src={'/api/users/photo/'+item.postedBy._id}
                            />
                        }
                        title={commentBody(item)}
                        className={classes.cardHeader}
                        key={i}
                    />
                );
            })
        }
    </div>)
}
