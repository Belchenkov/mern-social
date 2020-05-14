import React, { useState, useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';

import { makeStyles } from '@material-ui/core/styles'
import { create } from './api-post.js'
import auth from './../auth/auth-helper';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: '#efefef',
        padding: `${theme.spacing(3)}px 0px 1px`
    },
    card: {
        maxWidth:600,
        margin: 'auto',
        marginBottom: theme.spacing(3),
        backgroundColor: 'rgba(65, 150, 136, 0.09)',
        boxShadow: 'none'
    },
    cardContent: {
        backgroundColor: 'white',
        paddingTop: 0,
        paddingBottom: 0
    },
    cardHeader: {
        paddingTop: 8,
        paddingBottom: 8
    },
    photoButton: {
        height: 30,
        marginBottom: 5
    },
    input: {
        display: 'none',
    },
    textField: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        width: '90%'
    },
    submit: {
        margin: theme.spacing(2)
    },
    filename:{
        verticalAlign: 'super'
    }
}));

export default function NewPost ({ addUpdate }){
    const classes = useStyles();
    const [values, setValues] = useState({
        text: '',
        photo: '',
        error: '',
        user: {}
    });
    const jwt = auth.isAuthenticated();

    useEffect(() => {
        setValues({
            ...values,
            user: auth.isAuthenticated().user
        })
    }, [])

    const clickPost = () => {
        let postData = new FormData();
        postData.append('text', values.text);
        postData.append('photo', values.photo);

        create(
            { userId: jwt.user._id },
            { t: jwt.token },
            postData
        ).then(data => {
            if (data.error) {
                setValues({...values, error: data.error});
            } else {
                setValues({...values, text: '', photo: ''});
                addUpdate(data);
            }
        })
    }
}