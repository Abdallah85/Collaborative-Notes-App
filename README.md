# Collaborative Notes App

A collaborative note-taking application with user authentication, real-time editing, and edit history tracking.

## Features

- 🔐 User Authentication

  - Registration and Login
  - Password Reset via Email
  - Role-based Access Control
  - JWT Authentication

- 📝 Notes Management

  - Create, Read, Update, Delete Notes
  - Collaborative Editing
  - Edit History Tracking
  - Search and Filter Notes

- 👥 User Management
  - User Registration
  - Profile Management
  - Password Reset
  - Role-based Permissions

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/collaborative-notes-app.git
cd collaborative-notes-app
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/collaborative-notes
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=yourvalue
```

## Project Structure

```
src/
├── auth/                 # Authentication related files
│   ├── controller/      # Auth controllers
│   ├── middleware/      # Auth middleware
│   ├── routes/         # Auth routes
│   └── services/       # Auth services
├── notes/              # Notes related files
│   ├── controller/     # Notes controllers
│   ├── middleware/     # Notes middleware
│   ├── routes/        # Notes routes
│   └── services/      # Notes services
├── user/               # User related files
│   ├── controller/    # User controllers
│   ├── middleware/    # User middleware
│   ├── routes/       # User routes
│   └── services/     # User services
└── utils/             # Utility functions and helpers
```

## API Endpoints

### Authentication

```http
POST /auth/register
POST /auth/login
POST /auth/forgot-password
POST /auth/reset-password
POST /auth/change-password
```

### Notes

```http
POST /notes
GET /notes
GET /notes/:id
PUT /notes/:id
DELETE /notes/:id
PUT /notes/:id/edit
GET /notes/:id/history
```



## Running the Application

1. Start MongoDB:

```bash
mongod
```

2. Start the development server:

```bash
npm run dev
```

3. For production:

```bash
npm run build
npm start
```

## Testing

Run the test suite:

```bash
npm test
```

## Development

1. Install development dependencies:

```bash
npm install -D typescript @types/node @types/express
```

2. Start development server with hot reload:

```bash
npm run dev
```


## Error Handling

The application uses a centralized error handling mechanism. All errors are formatted as:

```json
{
  "status": "error",
  "message": "Error message",
  "code": "ERROR_CODE"
}
```

## Security

- Password hashing using bcrypt
- JWT authentication
- Input validation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@example.com or create an issue in the repository.
