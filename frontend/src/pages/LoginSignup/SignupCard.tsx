import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, InputAdornment, IconButton, OutlinedInput, Button, Grid } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { signup } from '../../utils/auth-utils';
import { AuthContext } from '../../context/AuthContext';

interface SignupCardProps {
    accountType?: string; // Define whether this is a user or club login
    signupURL: string
}
const SignupCard: React.FC<SignupCardProps> = ({ accountType, signupURL }) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [enteredEmail, setEnteredEmail] = React.useState("");
    const [enteredPassword, setEnteredPassword] = React.useState("");
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [signupSuccess, setSignupSuccess] = React.useState(false);
    const [badEmailWarning, setBadEmailWarning] = React.useState(false);
    const [badPasswordWarning, setBadPasswordWarning] = React.useState(false);

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

        // initialize signup info based on entered data
        const info = {
            email: enteredEmail,
            password: enteredPassword,
            first_name: firstName,
            last_name: lastName,
        }
        // Convert to lowercase for consistency
        let lcAccount = accountType?.toLowerCase();

        // Determine the specific backend endpoint based on what type of account this is
        const tokenURL = `${baseURL}/${lcAccount}/signup`;
        console.log(tokenURL);

        const success = await signup(info, tokenURL);
        if(success){ setSignupSuccess(true); }
        else{ console.error("something went wrong on backend"); }
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    return (
        <Card style={{ width: '100%' }}>
            <CardContent style={{ alignItems: 'left', textAlign: 'left', padding: 40 }}>
                {signupSuccess ? (
                    <>
                        <div className='roboto-medium' style={{marginBottom:20}}>Signup successful!</div>
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