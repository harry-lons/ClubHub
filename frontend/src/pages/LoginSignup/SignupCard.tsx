import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, TextField, InputAdornment, IconButton, OutlinedInput, Button } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';

interface SignupCardProps {
    accountType?: string; // Define whether this is a user or club login
    signupURL: string
}
const SignupCard: React.FC<SignupCardProps> = ({ accountType, signupURL }) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [enteredEmail, setEnteredEmail] = React.useState("");
    const [enteredPassword, setEnteredPassword] = React.useState("");
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

    const handleSubmitForm = async (event: React.MouseEvent<HTMLButtonElement>) => {
        let endpointURL = process.env.REACT_APP_BACKEND_URL;
        if (!endpointURL) {
            console.error('Backend base URL is not defined. Check your .env file');
            return;
        }
        // Create form-data from state
        const formData = new FormData();
        formData.append('username', enteredEmail);
        formData.append('password', enteredPassword);

        // TODO: Send backend request to sign up (add the user to the database)
        // SW ADDED:
        navigate('/login');//Please only put this in the successful path
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    return (
        <Card style={{ width: '100%' }}>
            <CardContent style={{ alignItems: 'left', textAlign: 'left', padding: 40 }}>
                {/* roboto medium, override font size to 18 as per figma */}
                <p className='roboto-medium' style={{ fontSize: 18, marginBottom: 20 }}>
                    SIGN UP {accountType === 'CLUB' ? '(club)' : null
                    }
                </p>
                {/* 
                
                COMMENTED OUT FOR NOW BECAUSE WE DON'T HAVE CLUB SIGNUP
                
                <div style={{ marginTop: 15, marginBottom:15 }}>
                    <p className="roboto-regular">
                        <Link to="/club/login" style={{ color: "#00cccccc" }}>
                            Click here for club signup
                        </Link> 
                    </p>
                </div> */}
                <div className='loginsignup-input-wrap'>
                    <p className='roboto-regular'>
                        Email
                    </p>
                    <TextField
                        variant="outlined"
                        fullWidth
                        type="email"
                        onChange={handleEmailChange}
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
                    SIGN UP
                </Button>
                <div style={{ marginTop: 15 }}>
                    <p className="roboto-regular">
                        Already have an account? <Link to="/login" style={{ color: "#00aaaa" }}>
                            Log In
                        </Link> instead.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
export default SignupCard;