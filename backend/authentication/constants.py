from fastapi import HTTPException, status

BAD_CREDIENTIALS_EXCEPTION = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Bad authentication credentials",
    headers={"WWW-Authenticate": "Bearer"},
)
