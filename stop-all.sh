#!/bin/bash

# Stop PostgreSQL
brew services stop postgresql@14

# Stop Express server and React client
# Find and kill Node.js processes that are using these ports
# Adjust the ports as necessary

# Find the PIDs of processes listening on the ports
EXPRESS_PID=$(lsof -ti :5001)
CLIENT_PID=$(lsof -ti :5176)

# Kill the processes
if [ -n "$EXPRESS_PID" ]; then
  echo "Stopping Express server with PID $EXPRESS_PID"
  kill -9 $EXPRESS_PID
else
  echo "No Express server process found"
fi

if [ -n "$CLIENT_PID" ]; then
  echo "Stopping React client with PID $CLIENT_PID"
  kill -9 $CLIENT_PID
else
  echo "No React client process found"
fi

# Close Google Chrome tabs pointing to localhost
osascript <<EOF
tell application "Google Chrome"
    set window_list to every window
    repeat with a_window in window_list
        set tab_list to every tab of a_window
        repeat with a_tab in tab_list
            if URL of a_tab contains "localhost" then
                close a_tab
            end if
        end repeat
    end repeat
end tell
EOF
