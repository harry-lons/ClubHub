import {userSignup} from '../types/types'

export const authenticate = async (endpoint: string, formData: FormData) => {
    // object to return
    let ret = {
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
    else if (element.length > 40){
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

export const validateSignupInput = (info: userSignup) => {
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
    if(!ret.passwordMessage) {
        if(password.length < 6) {
            ret.passwordMessage = "Must be at least 6 characters";
        }
    }

    if(ret.emailMessage || ret.passwordMessage || ret.firstNameMessage || ret.lastNameMessage){
        // If we have an error message, set success to false
        ret.success = false;
    }
    console.log(ret);

    return ret;
};

export const signup = async (info: userSignup, tokenURL: string) => {
    validateSignupInput(info);

    try {
        const response = await fetch(tokenURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(info)
        });

        if (!response.ok) {
            // Check if it was existing email error
            const message = await response.json();
            if (message.detail === "An account with this email already exists") {
                console.log(message.detail);
                // Handle this somehow on screen
            }
        }

        const data = await response.json();

        // Check if the response contains a token
        if (data.id) {
            console.log('ID received:', data.id);
            return true;
        } else {
            // Handle (unexpected) incorrect response from backend
            console.error('No ID found in the response');
            return false;
        }

    } catch (error) {
        // Handle other error codes (401 unauthorized, etc)
        console.error('There was a problem with the fetch operation:', error);
        return false;
    }
}