import React,{useEffect, useState} from 'react';
import { Avatar,Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import { LockOutlined } from '@material-ui/icons';
import {GoogleLogin} from 'react-google-login';
import {gapi} from 'gapi-script';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';

import Input from './Input.js';
import useStyles from './styles';
import Icon from './icon';
import {signin,signup} from '../../actions/auth';

const initialState = {firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }

const Auth = () => {
    const classes = useStyles();
    const [showPassword, setShowPassword] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const clientId= process.env.REACT_APP_CLIENTID;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialState);

    useEffect(() => {
        gapi.load("client: auth2", ()=>{
            gapi.auth2.init({clientId})
        })
    },[clientId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if(isSignup){
            dispatch(signup(formData,navigate));
        }else{
            dispatch(signin(formData,navigate));
        }
    }
    const handleChange = (e) => {
        setFormData({...formData,[e.target.name]: e.target.value});
    }

    const handleShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword );
    }

    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup );
        setShowPassword(false);
    }

    const googleSuccess = async (res) => {
        const result = res?.profileObj;  
        const token = res?.tokenId;

        try{
            dispatch({type:'AUTH' , data: {result, token} });
            navigate('/');
        }catch(err){
            console.log(err);
        }
    };

    const googleFailure = (err) => {
        console.log(err);
        console.log("Google Sign In was failed. Try again.");
    }

    return(
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlined/>
                </Avatar>
                <Typography variant="h5">{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        { isSignup && (
                            <>
                                <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />                            
                                <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                            </>
                        )}
                        <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                        <Input name="password" label="Password" handleChange={handleChange} type={ showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
                        {isSignup && <Input name="confirmPassword" label="Confirm Password" handleChange={handleChange} type={ showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />  }
                    </Grid>
                    <Button type="submit" fullWidth variant='contained' color="primary" className={classes.submit}>
                        {isSignup ? 'Sign Up' : 'Sign In'}
                    </Button>
                    <GoogleLogin
                        clientId= {clientId}
                        render = {(renderProps) => (
                            <Button className= {classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon/>} variant="contained">
                                Sign in with Google
                            </Button>
                        )}
                        onSuccess={googleSuccess}
                        onFailure={googleFailure}
                        cookiePolicy='single_host_origin'
                    />
                    <Grid container justifyContent='center'>
                        <Grid item>
                            <Button onClick={switchMode}>
                                 {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                            </Button>
                        </Grid>            
                    </Grid>    
                  
                </form>
            </Paper>
        </Container>
    )
}

export default Auth;