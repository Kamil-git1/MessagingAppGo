# Database Documentation for Messaging Application

This README file provides information about the database setup and usage for the messaging application.

## Database Overview

The messaging application uses a SQL database to store user information, messages, and contacts. The database schema is defined in the `schema.sql` file located in this directory.

## Setup Instructions

1. **Database Creation**: Create a new database for the messaging application. You can use the following SQL command:
   ```sql
   CREATE DATABASE messaging_app;
   ```

2. **Schema Initialization**: Run the `schema.sql` file to set up the necessary tables and relationships. You can execute the following command in your SQL client:
   ```sql
   SOURCE path/to/schema.sql;
   ```

3. **Database Configuration**: Ensure that your backend application is configured to connect to the database. Update the database connection settings in your backend configuration files as needed.

## Tables

The database includes the following tables:

- **Users**: Stores user information such as ID, phone number, email, username, and password.
- **Messages**: Contains message data, including sender ID, receiver ID, message content, and timestamps.
- **Contacts**: Maintains user contacts for easy access and management.

## Usage

The backend application will interact with the database to perform operations such as user registration, authentication, sending and receiving messages, and managing contacts. Ensure that the database is running and accessible before starting the backend server.

For more detailed information on the database schema, refer to the `schema.sql` file.