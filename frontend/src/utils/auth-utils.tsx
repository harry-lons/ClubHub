import { userSignup, signupResponse, loginResponse, signupInfo, clubSignup, login } from '../types/types'

export const authenticate = async (endpoint: string, formData: FormData) => {
    // object to return
    let ret:loginResponse = {
        success: false,
        token: "",
        detail: "",
    }
    try {
        const response = await fetch(`${endpoint}/login`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        if (response.status === 401) {
            // return the error message from backend
            ret.detail = data.detail;
            throw ("401 Error")
        }
        // Check if the response contains a token
        if (data.access_token) {
            ret.success = true;
            ret.token = data.access_token;
        } else {
            // Handle incorrect response from backend
            console.error('No token found in the response');
        }
    } catch (error) {
        // Handle errors
        console.error('There was a problem with the fetch operation:', error);
    } finally {
        return ret;
    }
}

export const clubAuthenticate = async (endpoint: string, info:login) => {
    // object to return
    let ret:loginResponse = {
        success: false,
        token: "",
        detail: "",
    }
    try {
        const response = await fetch(`${endpoint}/login`, {
            method: 'POST',
            body: JSON.stringify(info)
        });

        const data = await response.json();
        if (response.status === 401) {
            // return the error message from backend
            ret.detail = data.detail;
            throw ("401 Error")
        }
        // Check if the response contains a token
        if (data.access_token) {
            ret.success = true;
            ret.token = data.access_token;
        } else {
            // Handle incorrect response from backend
            console.error('No token found in the response');
        }
    } catch (error) {
        // Handle errors
        console.error('There was a problem with the fetch operation:', error);
    } finally {
        return ret;
    }
}

export const whoami = async (endpoint: string, token: string): Promise<string> => {
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

export const validateLoginInput = (enteredEmail: string, enteredPassword: string) => {
    let ret = {
        emailMessage: "",
        passwordMessage: ""
    }
    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (enteredEmail === "") {
        // No email entered
        ret.emailMessage = "Must enter an email";
    }
    else if (!emailRegex.test(enteredEmail)) {
        // Invalid email format
        ret.emailMessage = "Invalid email format";
    }

    if (enteredPassword === "") {
        ret.passwordMessage = "Must enter a password";
    }

    return ret;
};

const validateWithin40chars = (element: string) => {
    if (element === "") {
        // No string entered
        return "This field is required";
    }
    else if (element.length > 40) {
        // string too long
        return "Must be less than 40 characters";
    }
    else {
        // 
        return null;
    }
}

const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        // Invalid email format
        return "Invalid email format";
    }
    else return null;
}

export const validateUserSignupInput = (info: userSignup) => {
    const { email, password, first_name, last_name } = info;

    let ret = {
        success: true,
        // Reuse the function to apply DRY (don't repeat yourself) for each field
        emailMessage: validateWithin40chars(email),
        passwordMessage: validateWithin40chars(password),
        firstNameMessage: validateWithin40chars(first_name),
        lastNameMessage: validateWithin40chars(last_name)
    }
    if (!ret.emailMessage) {
        // Check email format
        ret.emailMessage = validateEmail(email);
    }
    if (!ret.passwordMessage) {
        if (password.length < 6) {
            ret.passwordMessage = "Must be at least 6 characters";
        }
    }

    if (ret.emailMessage || ret.passwordMessage || ret.firstNameMessage || ret.lastNameMessage) {
        // If we have an error message, set success to false
        ret.success = false;
    }

    return ret;
};

export const validateClubSignupInput = (info: clubSignup) => {
    const { email, password, name } = info;

    let ret = {
        success: true,
        // Reuse the function to apply DRY (don't repeat yourself) for each field
        emailMessage: validateWithin40chars(email),
        passwordMessage: validateWithin40chars(password),
        nameMessage: validateWithin40chars(name)
    }
    if (!ret.emailMessage) {
        // Check email format
        ret.emailMessage = validateEmail(email);
    }
    if (!ret.passwordMessage) {
        if (password.length < 6) {
            ret.passwordMessage = "Must be at least 6 characters";
        }
    }

    if (ret.emailMessage || ret.passwordMessage || ret.nameMessage) {
        // If we have an error message, set success to false
        ret.success = false;
    }

    return ret;
};

export const signupCall = async (info: signupInfo, tokenURL: string) => {
    
    let ret: signupResponse = {
        success: false,
        detail: "",
    }
    try {
        const response = await fetch(tokenURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(info)
        });

        if (!response.ok) {
            // send failure message back to signup card
            const message = await response.json();
            ret.detail = message.detail;
            return ret;
        }

        const data = await response.json();

        // Check if the response contains an id
        if (data.id) {
            console.log('ID received:', data.id);
            ret.success = true;
            return ret;
        } else {
            // Handle (unexpected) incorrect response from backend
            console.error('No ID found in the response');
            ret.detail = "Unexpected response from server";
            return ret;
        }

    } catch (error) {
        // Catch any other weird errors
        console.error('There was a problem with the fetch operation:', error);
        ret.detail = "An unknown error occured";
        return ret;
    }
}