import React from 'react';
import PropTypes from 'prop-types';

import Post from './Post';

export default function PostList ({ removeUpdate, posts }) {
    return (
        <div style={{marginTop: '24px'}}>
            {
                posts.map((item, i) => (
                    <Post post={item} key={i} onRemove={removeUpdate}/>
                    )
                )
            }
        </div>
    )
}
PostList.propTypes = {
    posts: PropTypes.array.isRequired,
    removeUpdate: PropTypes.func.isRequired
}
