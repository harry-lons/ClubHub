import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, InputAdornment, IconButton, OutlinedInput, Button, Grid, Snackbar, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { userSignup, clubSignup, signupInfo } from '../../types/types'
import { signupCall, validateClubSignupInput, validateUserSignupInput } from '../../utils/auth-utils';
import { AuthContext } from '../../context/AuthContext';

interface SignupCardProps {
    typeAccount?: string; // Define whether this is a user or club login
    signupURL: string
}
const SignupCard: React.FC<SignupCardProps> = ({ typeAccount, signupURL }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [enteredEmail, setEnteredEmail] = useState("");
    const [enteredPassword, setEnteredPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [clubName, setClubName] = useState("");
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [badEmailWarning, setBadEmailWarning] = useState<string | null>(null);
    const [badPasswordWarning, setBadPasswordWarning] = useState<string | null>(null);
    const [firstNameWarning, setFirstNameWarning] = useState<string | null>(null);
    const [lastNameWarning, setLastNameWarning] = useState<string | null>(null);
    const [clubNameWarning, setClubNameWarning] = useState<string | null>(null);
    const [accountType, setTypeAccount] = useState<string | null>(typeAccount ?? null);
    const [error, setError] = useState<string | null>(null);

    const { saveAuthenticationData } = useContext(AuthContext);
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
    const handleClubNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClubName(event.target.value);
    }

    const makeCall = async (info: signupInfo) => {
        let baseURL = process.env.REACT_APP_BACKEND_URL;
        if (!baseURL) {
            console.error('Backend base URL is not defined. Check your .env file');
            return;
        }

        // Determine the specific backend endpoint based on what type of account this is
        const tokenURL = `${baseURL}/${signupURL}`;

        const result = await signupCall(info, tokenURL);
        if (result.success) { setSignupSuccess(true); }
        else { setError(result.detail); }
    }

    const handleUserSubmit = async () => {
        // initialize signup info based on entered data
        const info: userSignup = {
            email: enteredEmail,
            password: enteredPassword,
            first_name: firstName,
            last_name: lastName,
        }
        const validation = validateUserSignupInput(info);

        if (!validation.success) {
            console.log("failed input validation");
            setBadEmailWarning(validation.emailMessage);
            setBadPasswordWarning(validation.passwordMessage);
            setFirstNameWarning(validation.firstNameMessage);
            setLastNameWarning(validation.lastNameMessage);
            // do not send request
            return;
        }

        makeCall(info);
    }

    const handleClubSubmit = async () => {
        console.log("club submit");
        const info: clubSignup = {
            email: enteredEmail,
            password: enteredPassword,
            name: clubName
        }
        const validation = validateClubSignupInput(info);
        if (!validation.success) {
            console.log("failed input validation");
            setBadEmailWarning(validation.emailMessage);
            setBadPasswordWarning(validation.passwordMessage);
            setClubNameWarning(validation.nameMessage);
            // do not send request
            return;
        }

        makeCall(info);
    }

    const handleSubmitForm = async (event: React.MouseEvent<HTMLButtonElement>) => {
        if (accountType === 'USER') {
            await handleUserSubmit();
        }
        else if (accountType === 'CLUB') {
            await handleClubSubmit();
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
                {signupSuccess ? (
                    <>
                        <div className='roboto-medium' style={{ marginBottom: 20 }}>Signup successful!</div>
                        Your account has been registered. Head over to the {' '}
                        <Link to={`/${accountType}/login`} style={{ color: "#00aaaa" }}>
                            login page
                        </Link>
                    </>
                ) : (
                    <>
                        {/* roboto medium, override font size to 18 as per figma */}
                        <div className="flex-row-between">
                            <p className="roboto-medium" style={{ fontSize: 18 }}>
                                SIGN UP {accountType === 'CLUB' ? '(club)' : null}
                            </p>
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
                            {
                                accountType === 'USER' ?
                                    <>
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
                                    </>
                                    :

                                    <Grid item xs={12}>
                                        <div className='loginsignup-input-wrap'>
                                            <p className='roboto-regular'>Club Name</p>
                                            <OutlinedInput
                                                fullWidth
                                                value={clubName}
                                                onChange={handleClubNameChange}
                                            />
                                            {clubNameWarning &&
                                                <p
                                                    style={{ color: "red", marginTop: 10 }}
                                                > {clubNameWarning}</p>
                                            }
                                        </div>
                                    </Grid>
                            }
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
                                <Link to={accountType === "USER" ? "/login" : "/club/login"} style={{ color: "#00aaaa" }}>
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