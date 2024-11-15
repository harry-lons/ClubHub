import React, { useEffect } from 'react';
import './LoginSignup.css';
import LoginCard from './LoginCard';
import SignupCard from './SignupCard';
import { Grid } from '@mui/material';

interface LoginSignupProps {
    which: string;
}

const LoginSignup: React.FC<LoginSignupProps> = ({ which }) => {

    // Effect hook
    useEffect(() => {
        console.log('Component mounted');
    });

    return (
        <div id='login-signup-container' >
            <Grid container id='login-signup-grid'>
                {/* Left Side - empty space */}
                <Grid item xs={7.5} />

                {/* Right Side - Card */}
                <Grid item xs={3.5} style={{ display: 'flex', justifyContent: 'center', fontFamily: 'Roboto' }}>
                    {
                        // Determine which card/props to put up based on the prop
                        which === 'LOG IN' ?
                            <LoginCard accountType={'USER'} loginURL={'/user/login'} /> :
                            which === 'CLUB LOG IN' ?
                                <LoginCard accountType={'CLUB'} loginURL={'/club/login'} /> :
                                which === 'SIGN UP' ?
                                    <SignupCard accountType={'USER'} signupURL={'user/signup'} /> :
                                    null
                    }
                </Grid>
            </Grid>
        </div>
    );
};

export default LoginSignup;
