#!/bin/bash

# Define the port number for the React client
REACT_PORT=5176

# Start PostgreSQL
brew services start postgresql@14

# Launch PostgreSQL
# psql -d glodex -U postgres

# Wait for PostgreSQL to be ready (adjust this duration if needed)
sleep 5

# Start the Express server
(cd server && npm start) &

# Start the React client
(cd client && npm run dev) &

# Wait for the React client to be ready (adjust this duration if needed)
sleep 5

# Open Google Chrome and navigate to localhost with the specified port
open -a "Google Chrome" http://localhost:$REACT_PORT
