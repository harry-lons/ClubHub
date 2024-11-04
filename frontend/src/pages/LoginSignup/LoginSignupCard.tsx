import React from 'react';

import { Grid, Card, CardContent, TextField, InputAdornment, IconButton, OutlinedInput, Button } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface LoginSignupCardProps {
    which?: string; // Define whether this is a login card or signup card
}
const LoginSignupCard: React.FC<LoginSignupCardProps> = ({ which }) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    return (
        <Card style={{ width: '100%' }}>
            <CardContent style={{ alignItems: 'left', textAlign: 'left', padding: 40 }}>
                {/* roboto medium, override font size to 18 as per figma */}
                <p className='roboto-medium' style={{ fontSize: 18, marginBottom: 40 }}>{which}</p>
                <div className='loginsignup-input-wrap'>
                    <p className='roboto-regular'>
                        Email
                    </p>
                    <TextField
                        variant="outlined"
                        fullWidth
                        type="email"
                    />
                </div>

                <div className='loginsignup-input-wrap'>
                    <p className='roboto-regular'>
                        Password
                    </p>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        fullWidth
                        type={showPassword ? 'text' : 'password'}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={
                                        showPassword ? 'hide the password' : 'display the password'
                                    }
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    onMouseUp={handleMouseUpPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </div>
                <Button
                    variant="contained"
                    fullWidth
                    id='logsign-submit-button'
                >
                    {which}
                </Button>
            </CardContent>
        </Card>
    )
}
export default LoginSignupCard;