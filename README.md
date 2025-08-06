# Messaging Application

This is a messaging application similar to Telegram, built with a Go backend and a Node.js frontend. The application allows users to send and receive messages in real-time, manage contacts, and authenticate securely.

## Project Structure

```
messaging-app
├── backend                # Go backend application
│   ├── main.go           # Entry point for the backend
│   ├── handlers           # Contains message handling logic
│   │   └── messages.go    # Functions for message operations
│   ├── models             # Data models
│   │   └── user.go        # User model and methods
│   ├── routes             # API routes
│   │   └── routes.go      # Route definitions
│   ├── utils              # Utility functions
│   │   └── auth.go        # Authentication utilities
│   └── README.md          # Backend documentation
├── frontend               # Node.js frontend application
│   ├── src                # Source files for the frontend
│   │   ├── index.js       # Entry point for the frontend
│   │   ├── components      # React components
│   │   │   └── ChatWindow.js # Chat interface component
│   │   ├── styles          # CSS styles
│   │   │   └── main.css    # Main styles for the application
│   │   └── utils           # Utility functions for API calls
│   │       └── api.js      # API call functions
│   ├── package.json        # Frontend dependencies and scripts
│   └── README.md           # Frontend documentation
├── database               # Database setup
│   ├── schema.sql         # SQL schema for the database
│   └── README.md          # Database documentation
└── README.md              # Overall project documentation
```

## Features

### Basic Functionalities
- User registration and authentication
- Sending and receiving messages
- Real-time chat interface
- Contact management

### Advanced Functionalities
- Group chats
- Message history and search
- User presence indicators
- Secure authentication with token-based sessions

## Getting Started

### Backend
1. Navigate to the `backend` directory.
2. Install Go dependencies.
3. Run the application using `go run main.go`.

### Frontend
1. Navigate to the `frontend` directory.
2. Install Node.js dependencies using `npm install`.
3. Start the frontend application with `npm start`.

### Database
1. Set up the database using the schema defined in `schema.sql`.
2. Follow the instructions in the `database/README.md` for configuration.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.