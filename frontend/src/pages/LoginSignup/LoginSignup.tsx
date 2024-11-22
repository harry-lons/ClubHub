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
                <Grid item xs={which === 'LOG IN' || which === 'CLUB LOG IN' ? 7.5 : 5} />

                {/* Right Side - Card */}
                <Grid item xs={which === 'LOG IN' || which === 'CLUB LOG IN' ? 3.5 : 6} style={{ display: 'flex', justifyContent: 'center', fontFamily: 'Roboto' }}>
                    {
                        // Determine which card/props to put up based on the prop
                        which === 'LOG IN' ?
                            <LoginCard accountType={'USER'} /> :
                            which === 'CLUB LOG IN' ?
                                <LoginCard accountType={'CLUB'} /> :
                                which === 'SIGN UP' ?
                                    <SignupCard accountType={'USER'} signupURL={'user/signup'} /> :
                                    which === 'CLUB SIGN UP' ?
                                        <SignupCard accountType={'CLUB'} signupURL={'club/signup'} /> :
                                        null
                    }
                </Grid>
            </Grid>
        </div>
    );
};

export default LoginSignup;
