import React, {useState, useEffect} from 'react';
import {Container, Grow, Grid} from '@material-ui/core';
import {useDispatch} from 'react-redux';

import Posts from '../Posts/Posts.js';
import Form from '../Form/Form.js';
import {getPosts} from '../../actions/posts.js';
import useStyles from './styles.js';
import Pagination from '../Pagination.jsx';

const Home = () => {
    const [currentId, setCurrentId] = useState(null);
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPosts());
    },[currentId, dispatch]);

    return(
        <Grow in>
            <Container>
                <Grid container className={classes.mainContainer} justifyContent="space-between" alignItems='stretch' spacing={3}>
                    <Grid item xs={12} sm={7}>
                        <Posts setcurrentId={setCurrentId}/>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Form currentId={currentId} setcurrentId={setCurrentId}/>
                    </Grid>
                </Grid>
            </Container>
        </Grow>
    )
}
export default Home;