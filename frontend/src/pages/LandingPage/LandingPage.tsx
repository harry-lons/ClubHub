import React from 'react';
import Diversity2Icon from '@mui/icons-material/Diversity2';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

import './LandingPage.css';



export const LandingPage = () => {


    // Cache allows a .css file to overwrite MUI styles. Basically, we
    // will be able to use a css file to style MUI stuff
    // See https://github.com/mui/material-ui/issues/38142
    const cache = createCache({
        key: 'css',
        prepend: true,
    });

    const navigate = useNavigate();

    const loginSigupButtonClick = () => {
        navigate('/login');
    };

    const eventButtonClick = () => {
        navigate('/events')
    }

    const clubButtonClick = () => {
        navigate('/clubs')
    }

    return (
        <CacheProvider value={cache}>
            <div className="body">
                <header className="header">
                    <div className="icon">
                        <Diversity2Icon sx={{ display: { xs: 'none', md: 'flex', color: 'white' }, mr: 1 }} />
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'white',
                                textDecoration: 'none',
                            }}
                            onClick={() => navigate('/homepage')}
                        >
                            SoCalSocial
                        </Typography>
                    </div>
                    <Button
                        className="login-signup-btn"
                        variant="contained"
                        color="primary"
                        onClick={loginSigupButtonClick}
                    >
                        LOGIN/SIGNUP
                    </Button>
                </header>
                <div className="main">
                    <div className="center">
                        <div className="main-content">
                            <h2>Welcome to Your Campus Hub</h2>
                            <p>Our platform brings the entire university community together. Discover events, connect with clubs, and stay up-to-date with what's happening on campus.</p>
                            <div className="button-container">
                                <Button
                                    className="button"
                                    variant="contained"
                                    color="primary"
                                    onClick={eventButtonClick}
                                >
                                    Find my event
                                    <span className="arrow"></span>
                                </Button>
                                <Button
                                    className="button"
                                    variant="contained"
                                    color="primary"
                                    onClick={clubButtonClick}
                                >
                                    Find my club
                                    <span className="arrow"></span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>



                <div className="below">
                    <div className="center">
                        <div className="container">
                            <div className="column">
                                <h3>For Students</h3>
                                <p>Find events that matter to you, follow your favorite clubs, and keep track of upcoming activities. Be in the know and plan your campus life effortlessly.</p>
                            </div>

                            <div className="column">
                                <h3>For Organizations</h3>
                                <p>Create events and share them with a wide audience - it's easier than ever to get the word out.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CacheProvider>
    )
}