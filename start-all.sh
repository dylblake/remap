#!/bin/bash

# Start PostgreSQL
brew services start postgresql@14

# Launch PostgreSQL
psql -d glodex -U postgres

# Wait for PostgreSQL to be ready (adjust this duration if needed)
sleep 5

# Start the Express server
(cd server && npm start) &

# Start the React client
(cd client && npm run dev) &
