import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, TextField, InputAdornment, IconButton, OutlinedInput, Button, Snackbar } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';

interface LoginCardProps {
    accountType?: string; // Define whether this is a user or club login
}
const LoginCard: React.FC<LoginCardProps> = ({ accountType }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [enteredEmail, setEnteredEmail] = useState("");
    const [enteredPassword, setEnteredPassword] = useState("");
    const [badEmailWarning, setBadEmailWarning] = useState(false);
    const [badPasswordWarning, setBadPasswordWarning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { saveToken, setAccountType, setId } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEnteredEmail(event.target.value);
    };

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEnteredPassword(event.target.value);
    };

    const inputIsValid = () => {
        var returnValue = true;
        setBadEmailWarning(false);
        setBadPasswordWarning(false);

        if (enteredEmail === "") {
            // No email entered
            setBadEmailWarning(true);
            returnValue = false;
        }

        // Regular expression to validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(enteredEmail)) {
            // Invalid email format
            setBadEmailWarning(true);
            returnValue = false;
        }

        if (enteredPassword === "") {
            setBadPasswordWarning(true);
            returnValue = false;
        }

        return returnValue;
    }

    const authenticate = async (endpoint: string, formData: FormData) => {
        try {
            const response = await fetch(`${endpoint}/login/`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            // Check if the response contains a token
            if (data.access_token) {
                // console.log('Token received:', data.access_token);
                return data.access_token;
            } else {
                // Handle (unexpected) incorrect response from backend
                console.error('No token found in the response');

                return null;
            }

        } catch (error) {
            // Handle other error codes (401 unauthorized, etc)
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    const whoami = async (endpoint: string, token: string): Promise<string> => {
        try {
            const response = await fetch(`${endpoint}/whoami/`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Error fetching user info: ${response.statusText}`);
            }

            const user = await response.json(); // Assuming the response is the `User` model
            return user.id;
        } catch (error) {
            console.error("Failed to fetch user info:", error);
            throw error;
        }
    };


    const handleSubmitForm = async (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!inputIsValid()) {
            // Failed input check, do not submit
            return;
        }
        let baseURL = process.env.REACT_APP_BACKEND_URL;
        if (!baseURL) {
            console.error('Backend base URL is not defined. Check your .env file');
            return;
        }
        // Create form-data from state
        const formData = new FormData();
        formData.append('username', enteredEmail);
        formData.append('password', enteredPassword);

        if (!accountType || (accountType !== 'USER' && accountType !== 'CLUB')) {
            // Something went very wrong, just go back to / with error
            console.error("Somehow lost state on whether this was club or user login!");
            window.location.href = '/';
        }

        // Convert to lowercase for consistency
        let lcAccount = accountType?.toLowerCase();

        // Determine the specific backend endpoint based on what type of account this is
        const endpoint = `${baseURL}/${lcAccount}`;
        const token = await authenticate(endpoint, formData);
        if (!token) {
            // error in fetch was already printed to console in authenticate, just show user an error
            setError("Error logging in")
            return;
        }
        saveToken(token);  // Store the token in context
        setAccountType(accountType === 'CLUB' ? 'club' : 'user');
        const id = await whoami(endpoint, token);

        // Put the id in context
        setId(id);

        navigate('/events');     // Redirect to /events page

    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    return (
        <Card style={{ width: '100%' }}>
            {error &&
                <Snackbar
                    open={true}
                    autoHideDuration={6000}
                    message={error}
                    onClose={() => setError(null)}
                />}
            <CardContent style={{ alignItems: 'left', textAlign: 'left', padding: 40 }}>
                {/* roboto medium, override font size to 18 as per figma */}
                <p className='roboto-medium' style={{ fontSize: 18, marginBottom: 20 }}>
                    LOG IN {accountType === 'CLUB' ? '(club)' : null
                    }
                </p>
                <div style={{ marginTop: 15, marginBottom: 15 }}>
                    <p className="roboto-regular">
                        <Link to={accountType === 'CLUB' ? '/login' : '/club/login'} style={{ color: "#00cccccc" }}>
                            Click here for {accountType === 'CLUB' ? 'user' : 'club'} login
                        </Link>
                    </p>
                </div>
                <div className='loginsignup-input-wrap'
                    // Override styles if there's an email warning above this
                    style={badEmailWarning ? { marginBottom: 10 } : {}}
                >
                    <p className='roboto-regular'>
                        Email
                    </p>
                    <TextField
                        variant="outlined"
                        data-testid="emailInput"
                        fullWidth
                        type="email"
                        onChange={handleEmailChange}
                    />
                    {badEmailWarning ?
                        <p
                            style={{ color: "red", marginTop: 10 }}
                        > Enter a valid email</p>
                        :
                        null
                    }
                </div>

                <div className='loginsignup-input-wrap'
                    style={badEmailWarning ? { marginBottom: 10 } : {}}
                >
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
                {badPasswordWarning ?
                    <p
                        style={{ color: "red", marginTop: 10, marginBottom: 10 }}
                    > Enter a password</p>
                    :
                    null
                }
                <Button
                    variant="contained"
                    fullWidth
                    id='logsign-submit-button'
                    onClick={handleSubmitForm}
                >
                    LOG IN
                </Button>
                <div style={{ marginTop: 15 }}>
                    <p className="roboto-regular">
                        Don't have an account? <Link to="/signup" style={{ color: "#00aaaa" }}>
                            Sign up
                        </Link> instead.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
export default LoginCard;