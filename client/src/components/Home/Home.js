import React, {useState} from 'react';
import {Container, Grow, Grid,Paper, AppBar, TextField, Button} from '@material-ui/core';
import ChipInput from 'material-ui-chip-input';
import {useDispatch} from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import Posts from '../Posts/Posts.js';
import Form from '../Form/Form.js';
import {getPostsBySearch} from '../../actions/posts.js';
import useStyles from './styles.js';
import Pagination from '../Pagination.jsx';

function useQuery(){
    return new URLSearchParams(useLocation().search);
}

const Home = () => {
    const [currentId, setCurrentId] = useState(null);
    const classes = useStyles();
    const dispatch = useDispatch();
    const query = useQuery();
    const navigate = useNavigate();
    const page = query.get('page') || 1;
    const searchQuery = query.get('searchQuery');
    const [search,setSearch] = useState('');
    const [tags,setTags] = useState([]);

    const searchPost = () => {
        if(search.trim() || tags){
            dispatch(getPostsBySearch({search, tags: tags.join(',') }));
            navigate(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`);
        }else{
            navigate('/');
        }
    }

    const handleKeyPress = (e) =>{
        if(e.keyCode === 13){
            searchPost();
        }
    }

    const handleAdd = (tag) => setTags([...tags, tag]);
    const handleDelete = (tagToDELETE) => setTags(tags.filter((tag) => tag !== tagToDELETE));  

     return(
        <Grow in>
            <Container maxWidth="xl">
                <Grid container className={classes.gridContainer} justifyContent="space-between" alignItems='stretch' spacing={3}>
                    <Grid item xs={12} sm={7} md={9}>
                        <Posts setcurrentId={setCurrentId}/>
                    </Grid>
                    <Grid item xs={12} sm={5} md={3}>
                        <AppBar className={classes.appBarSearch} position='static' color="inherit">
                            <TextField name="search" variant="outlined" label="Search Memories" onKeyPress={handleKeyPress} fullWidth value={search} onChange={(e)=> setSearch(e.target.value)}/>
                            <ChipInput style={{margin:'10px 0'}} value={tags} onAdd={handleAdd} onDelete={handleDelete} label="Search Tags" variant="outlined"/>
                            <Button onClick={searchPost} className={classes.searchButton} variant="contained" color="primary">Search</Button>
                        </AppBar>
                        <Form currentId={currentId} setcurrentId={setCurrentId}/>
                        {(!searchQuery && !tags.length) && (
                            <Paper elevation={6} className={classes.pagination}>
                                <Pagination page={page}/>
                            </Paper>
                        )}                        
                    </Grid>
                </Grid>
            </Container>
        </Grow>
    )
}
export default Home;