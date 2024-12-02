#!/bin/bash
## Valid inputs are frontend (f) ,backend (b) or database (db)

if [[ "$1" = "frontend" || "$1" = "f" ]]; then
    cd frontend
    npm start
elif [[ "$1" = "backend" || "$1" = "b" ]]; then
    cd backend/src
    python -m fastapi dev app.py
elif [[ "$1" = "database" || "$1" = "db" ]]; then
    psql -h aws-0-us-east-1.pooler.supabase.com -p 5432 -U postgres.biwjwtrxfwxcltkctfqx -d postgres
else 
    echo "INVALID ARGUMENT: ONLY VALID ARGUMENTS are frontend, backend or database"
fi