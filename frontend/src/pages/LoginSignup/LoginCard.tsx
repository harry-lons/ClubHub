import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, TextField, InputAdornment, IconButton, OutlinedInput, Button } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';

interface LoginCardProps {
    accountType?: string; // Define whether this is a user or club login
    loginURL: string;
}
const LoginCard: React.FC<LoginCardProps> = ({ accountType, loginURL }) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [enteredUsername, setEnteredUsername] = React.useState("");
    const [enteredPassword, setEnteredPassword] = React.useState("");
    const { saveToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEnteredUsername(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEnteredPassword(event.target.value);
    };

    const handleSubmitForm = async (event: React.MouseEvent<HTMLButtonElement>) => {
        let baseURL = process.env.REACT_APP_BACKEND_URL;
        if (!baseURL) {
            console.error('Backend base URL is not defined. Check your .env file');
            return;
        }
        // Create form-data from state
        const formData = new FormData();
        formData.append('username', enteredUsername);
        formData.append('password', enteredPassword);

        if (!accountType || (accountType !== 'USER' && accountType !== 'CLUB')) {
            // Something went very wrong, just go back to / with error
            console.error("Lost state on whether this was club or user login!");
            window.location.href = '/';
        }
        // Convert to lowercase for consistency
        let lcAccount = accountType?.toLowerCase();

        // Determine the specific backend endpoint based on what type of account this is

        // TODO: Switch to the commented version once backend club login is implemented

        // let tokenURL = `${baseURL}/${lcAccount}/login`;
        const tokenURL = `${baseURL}${loginURL}`;

        try {
            const response = await fetch(tokenURL, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Response:', data);

            // Check if the response contains a token
            if (data.access_token) {
                console.log('Token received:', data.access_token);
                saveToken(data.access_token);  // Store the token in context
                navigate('/events');     // Redirect to /events page
            } else {
                // Handle (unexpected) incorrect response from backend
                console.error('No token found in the response');
            }

        } catch (error) {
            // Handle other error codes (401 unauthorized, etc)
            console.error('There was a problem with the fetch operation:', error);
        }
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    return (
        <Card style={{ width: '100%' }}>
            <CardContent style={{ alignItems: 'left', textAlign: 'left', padding: 40 }}>
                {/* roboto medium, override font size to 18 as per figma */}
                <p className='roboto-medium' style={{ fontSize: 18, marginBottom: 40 }}>
                    LOG IN {accountType === 'CLUB' ? 'AS CLUB' : null
                    }
                </p>
                <div className='loginsignup-input-wrap'>
                    <p className='roboto-regular'>
                        Email
                    </p>
                    <TextField
                        variant="outlined"
                        data-testid="emailInput"
                        fullWidth
                        type="email"
                        onChange={handleUsernameChange}
                    />
                </div>

                <div className='loginsignup-input-wrap'>
                    <p className='roboto-regular'>
                        Password
                    </p>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        fullWidth
                        data-testid="passwordInput"
                        type={showPassword ? 'text' : 'password'}
                        value={enteredPassword}
                        onChange={handlePasswordChange}
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
                    onClick={handleSubmitForm}
                >
                    LOG IN
                </Button>
            </CardContent>
        </Card>
    )
}
export default LoginCard;