import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';

import { unfollow, follow } from './api-user.js'

export default function FollowProfileButton ({ onButtonClick, following }) {
    const followClick = () => {
        onButtonClick(follow)
    };

    const unfollowClick = () => {
        onButtonClick(unfollow)
    };

    return (
        <div>
            {   following
                ? (<Button variant="contained" color="secondary" onClick={unfollowClick}>Unfollow</Button>)
                : (<Button variant="contained" color="primary" onClick={followClick}>Follow</Button>)
            }
        </div>
    );
}

FollowProfileButton.propTypes = {
    following: PropTypes.bool.isRequired,
    onButtonClick: PropTypes.func.isRequired
}
