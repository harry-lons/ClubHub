import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, InputAdornment, IconButton, OutlinedInput, Button, Grid, Snackbar } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { userSignup } from '../../types/types'
import { signup, validateSignupInput } from '../../utils/auth-utils';
import { AuthContext } from '../../context/AuthContext';

interface SignupCardProps {
    accountType?: string; // Define whether this is a user or club login
    signupURL: string
}
const SignupCard: React.FC<SignupCardProps> = ({ accountType, signupURL }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [enteredEmail, setEnteredEmail] = useState("");
    const [enteredPassword, setEnteredPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [badEmailWarning, setBadEmailWarning] = useState<string | null>(null);
    const [badPasswordWarning, setBadPasswordWarning] = useState<string | null>(null);
    const [firstNameWarning, setFirstNameWarning] = useState<string | null>(null);
    const [lastNameWarning, setLastNameWarning] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { saveToken } = useContext(AuthContext);
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

    const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(event.target.value);
    }
    const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(event.target.value);
    }

    const handleSubmitForm = async (event: React.MouseEvent<HTMLButtonElement>) => {
        // initialize signup info based on entered data
        const info: userSignup = {
            email: enteredEmail,
            password: enteredPassword,
            first_name: firstName,
            last_name: lastName,
        }
        const validation = validateSignupInput(info);

        if (!validation.success) {
            console.log("failed input validation");
            setBadEmailWarning(validation.emailMessage);
            setBadPasswordWarning(validation.passwordMessage);
            setFirstNameWarning(validation.firstNameMessage);
            setLastNameWarning(validation.lastNameMessage);
            // do not send request
            return;
        }

        let baseURL = process.env.REACT_APP_BACKEND_URL;
        if (!baseURL) {
            console.error('Backend base URL is not defined. Check your .env file');
            return;
        }

        // Convert to lowercase for consistency
        let lcAccount = accountType?.toLowerCase();

        // Determine the specific backend endpoint based on what type of account this is
        const tokenURL = `${baseURL}/${lcAccount}/signup`;
        console.log(tokenURL);

        const result = await signup(info, tokenURL);
        if (result.success) { setSignupSuccess(true); }
        else { setError(result.detail); }
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
                {signupSuccess ? (
                    <>
                        <div className='roboto-medium' style={{ marginBottom: 20 }}>Signup successful!</div>
                        Your account has been registered. Head over to the {' '}
                        <Link to="/login" style={{ color: "#00aaaa" }}>
                            login page
                        </Link>
                    </>
                ) : (
                    <>
                        {/* roboto medium, override font size to 18 as per figma */}
                        <p className='roboto-medium' style={{ fontSize: 18, marginBottom: 20 }}>
                            SIGN UP {accountType === 'CLUB' ? '(club)' : null}
                        </p>
                        <Grid container>
                            {/* Email Input */}
                            <Grid item xs={5.5}>
                                <div className='loginsignup-input-wrap'>
                                    <p className='roboto-regular'>Email</p>
                                    <OutlinedInput
                                        fullWidth
                                        type="email"
                                        value={enteredEmail}
                                        onChange={handleEmailChange}
                                    />
                                    {badEmailWarning &&
                                        <p
                                            style={{ color: "red", marginTop: 10 }}
                                        > {badEmailWarning}</p>
                                    }
                                </div>
                            </Grid>
                            <Grid item xs={1} />
                            {/* Password Input */}
                            <Grid item xs={5.5}>
                                <div className='loginsignup-input-wrap'>
                                    <p className='roboto-regular'>Password</p>
                                    <OutlinedInput
                                        fullWidth
                                        type={showPassword ? 'text' : 'password'}
                                        value={enteredPassword}
                                        onChange={handlePasswordChange}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label={
                                                        showPassword
                                                            ? 'hide the password'
                                                            : 'display the password'
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
                                    {badPasswordWarning &&
                                        <p
                                            style={{ color: "red", marginTop: 10 }}
                                        > {badPasswordWarning}</p>
                                    }
                                </div>
                            </Grid>
                            {/* First Name Input */}
                            <Grid item xs={5.5}>
                                <div className='loginsignup-input-wrap'>
                                    <p className='roboto-regular'>First Name</p>
                                    <OutlinedInput
                                        fullWidth
                                        value={firstName}
                                        onChange={handleFirstNameChange}
                                    />
                                    {firstNameWarning &&
                                        <p
                                            style={{ color: "red", marginTop: 10 }}
                                        > {firstNameWarning}</p>
                                    }
                                </div>
                            </Grid>
                            <Grid item xs={1} />
                            {/* Last Name Input */}
                            <Grid item xs={5.5}>
                                <div className='loginsignup-input-wrap'>
                                    <p className='roboto-regular'>Last Name</p>
                                    <OutlinedInput
                                        fullWidth
                                        value={lastName}
                                        onChange={handleLastNameChange}
                                    />
                                    {lastNameWarning &&
                                        <p
                                            style={{ color: "red", marginTop: 10 }}
                                        > {lastNameWarning}</p>
                                    }
                                </div>
                            </Grid>
                        </Grid>
                        {/* Submit Button */}
                        <Button
                            variant="contained"
                            fullWidth
                            id='logsign-submit-button'
                            onClick={handleSubmitForm}
                        >
                            SIGN UP
                        </Button>
                        <div style={{ marginTop: 15 }}>
                            <p className="roboto-regular">
                                Already have an account?{' '}
                                <Link to="/login" style={{ color: "#00aaaa" }}>
                                    Log In
                                </Link>{' '}
                                instead.
                            </p>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>


    )
}
export default SignupCard;