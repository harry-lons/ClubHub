import React, { useState, useEffect } from 'react';
import './LoginSignup.css';
import LoginSignupCard from './LoginSignupCard';
import { Grid, Card, CardContent, Typography } from '@mui/material';

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
                <Grid item xs={3.5} style={{ display: 'flex', justifyContent: 'center', fontFamily:'Roboto' }}>
                    <LoginSignupCard which={which}/>
                </Grid>
            </Grid>
        </div>
    );
};

export default LoginSignup;
