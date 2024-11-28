import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, TextField, InputAdornment, IconButton, OutlinedInput, Button, Snackbar, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { authenticate, whoami, validateLoginInput, clubAuthenticate } from '../../utils/auth-utils';
import { AuthContext } from '../../context/AuthContext';
import { login } from '../../types/types';

interface LoginCardProps {
    typeAccount?: string; // Define whether this is a user or club login
}
const LoginCard: React.FC<LoginCardProps> = ({ typeAccount }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [enteredEmail, setEnteredEmail] = useState("");
    const [enteredPassword, setEnteredPassword] = useState("");
    const [badEmailWarning, setBadEmailWarning] = useState<string | null>(null);
    const [badPasswordWarning, setBadPasswordWarning] = useState<string | null>(null);
    const [accountType, setTypeAccount] = useState<string | null>(typeAccount ?? null);
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

    const handleSubmitForm = async (event: React.MouseEvent<HTMLButtonElement>) => {
        const validation = validateLoginInput(enteredEmail, enteredPassword)
        if (validation.emailMessage || validation.passwordMessage) {
            // Failed input check, do not send request
            setBadEmailWarning(validation.emailMessage);
            setBadPasswordWarning(validation.passwordMessage);
            return;
        }
        else {
            // disable input warnings
            setBadEmailWarning(null);
            setBadPasswordWarning(null);
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
        const info: login = {
            email: enteredEmail,
            password: enteredPassword
        }

        if (!accountType || (accountType !== 'USER' && accountType !== 'CLUB')) {
            // Something went very wrong, just go back to / with error
            console.error("Somehow lost state on whether this was club or user login!");
            window.location.href = '/';
        }

        // Convert to lowercase for consistency
        let lcAccount = accountType?.toLowerCase();

        // Determine the specific backend endpoint based on what type of account this is
        const endpoint = `${baseURL}/${lcAccount}`;
        var authresponse;
        if(accountType === "CLUB"){
            authresponse = await clubAuthenticate(endpoint, info);
        }
        const authResponse = await authenticate(endpoint, formData);
        if (!authResponse.success) {
            console.log("unsuccessful")
            // error in fetch was already printed to console in authenticate, just show user an error
            console.log(authResponse.detail)
            setError(authResponse.detail)
            return;
        }
        else if (authResponse.token !== "") {
            const token = authResponse.token;
            saveToken(token);  // Store the token in context
            setAccountType(accountType === 'CLUB' ? 'club' : 'user'); // set the account type in context
            const id = await whoami(endpoint, token);
            // Put the id in context
            setId(id);
        }
        if (accountType === "CLUB") {
            navigate('/club/events');
        }
        else {
            navigate('/events');     // Redirect to /events page
        }

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
                <div className='flex-row-between' >
                    <p className='roboto-medium' style={{ fontSize: 18 }}>
                        LOG IN {accountType === 'CLUB' ? '(club)' : null
                        }
                    </p>
                    {/* Add an element here which is on the right side of the parent*/}
                    <ToggleButtonGroup
                        color="primary"
                        value={accountType}
                        exclusive
                        onChange={(event, value) => setTypeAccount(value)}
                        aria-label="Platform"
                    >
                        <ToggleButton value="USER">User</ToggleButton>
                        <ToggleButton value="CLUB">Club</ToggleButton>
                    </ToggleButtonGroup>
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
                    {badEmailWarning &&
                        <p
                            style={{ color: "red", marginTop: 10 }}
                        > {badEmailWarning}</p>
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
                {badPasswordWarning &&
                    <p
                        style={{ color: "red", marginTop: 10, marginBottom: 10 }}
                    >{badPasswordWarning}</p>
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
                    {
                        accountType === "USER" ?
                            <p className="roboto-regular">
                                Don't have an account? <Link to="/signup" style={{ color: "#00aaaa" }}>
                                    Sign up
                                </Link> instead.
                            </p>
                            :
                            <p className="roboto-regular">
                                Club not registered? <Link to="/club/signup" style={{ color: "#00aaaa" }}>
                                    Sign up
                                </Link> instead.
                            </p>
                    }

                </div>
            </CardContent>
        </Card>
    )
}
export default LoginCard;