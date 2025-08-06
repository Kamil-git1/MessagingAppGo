# Messaging Application Backend

This is the backend for the messaging application, built using Go. The backend is responsible for handling user authentication, message management, and providing API endpoints for the frontend application.

## Project Structure

- **main.go**: Entry point of the application. Initializes the server and sets up routes.
- **handlers/**: Contains functions for handling various operations related to messages.
  - **messages.go**: Functions for sending and receiving messages.
- **models/**: Defines the data models used in the application.
  - **user.go**: User model with properties and methods for registration and authentication.
- **routes/**: Sets up the API routes for the application.
  - **routes.go**: Links routes to their respective handler functions.
- **utils/**: Utility functions for various operations.
  - **auth.go**: Functions for authentication, including token generation and validation.

## Setup Instructions

1. **Install Go**: Ensure you have Go installed on your machine. You can download it from [golang.org](https://golang.org/dl/).

2. **Clone the Repository**: Clone the repository to your local machine.

   ```
   git clone <repository-url>
   ```

3. **Navigate to the Backend Directory**:

   ```
   cd messaging-app/backend
   ```

4. **Install Dependencies**: Use Go modules to manage dependencies. Run the following command:

   ```
   go mod tidy
   ```

5. **Run the Application**: Start the server by running:

   ```
   go run main.go
   ```

   The server will start listening for incoming requests.

## API Usage

The backend exposes several API endpoints for the frontend to interact with. Below are some of the key endpoints:

- **User Registration**: `POST /api/register`
- **User Login**: `POST /api/login`
- **Send Message**: `POST /api/messages/send`
- **Receive Messages**: `GET /api/messages`

Refer to the individual handler files for more detailed information on each endpoint and its expected request/response format.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.