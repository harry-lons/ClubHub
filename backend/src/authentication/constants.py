from fastapi import HTTPException, status

BAD_CREDIENTIALS_EXCEPTION = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Bad authentication credentials",
    headers={"WWW-Authenticate": "Bearer"},
)

LOGIN_BAD_PASSWORD = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Password is incorrect",
)

LOGIN_BAD_EMAIL = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Email does not exist",
)

SIGNUP_EMAIL_EXISTS = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="An account with this email already exists",
)

SIGNUP_PASSWORD_COMPLEXITY = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST,
    detail="The password does not meet complexity requirements",
)

LOGIN_SIGNUP_OTHER_ERROR = HTTPException(
    status_code=status.HTTP_400_BAD_REQUEST, detail="Error"
)
