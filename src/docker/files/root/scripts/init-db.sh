#!/bin/bash
psql -U postgres checkmate -c "create ROLE checkmate WITH PASSWORD 'checkmate' LOGIN SUPERUSER;"
echo "$POSTGRES_HOST:*:*:checkmate:postgres" > ~/.pgpass && chmod 600 ~/.pgpass
psql -U postgres checkmate -c "create SCHEMA checkmate"
