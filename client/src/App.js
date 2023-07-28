import React from 'react';
import {BrowserRouter, Routes, Route, Redirect} from 'react-router-dom';
import {Container} from '@material-ui/core';

import Navbar from './components/Navbar/Navbar'; 
import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';
import PostDetails from './components/PostDetails/PostDetails';

const App = () => {
    const user = JSON.parse(localStorage.getItem('profile'));
    return(
        <BrowserRouter>
            <Container maxWidth= "xl">
                <Navbar/>
                <Routes>
                    <Route path='/' element={() => <Redirect to='/posts'/>} />
                    <Route path='/posts' exact element= {<Home/>} />
                    <Route path='/posts/search?searchQuery' exact element= {<Home/>} />
                    <Route path='/posts/:id' exact element= {<PostDetails/>} />
                    <Route path='/auth' element={() => (!user ? <Auth/> : <Redirect to='/posts'/>)} />
                </Routes>
            </Container>
       </BrowserRouter>
    ); 
}
export default App;