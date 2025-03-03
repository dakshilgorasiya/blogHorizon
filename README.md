# BlogHorizon

BlogHorizon is a full-featured blogging platform built using the MERN stack. It allows users to create, update, like, comment, and report blogs. Users can follow/unfollow other users, bookmark blogs, and interact through replies and likes on comments. The platform also includes an admin dashboard for managing reports and content moderation.

## Features

- **User Authentication**

  - JWT-based authentication
  - Google OAuth login

- **Blog Management**

  - Create, update, and delete blogs
  - Upload images in blogs
  - Write and format text (like in Microsoft Word)
  - Embed code snippets

- **Interactions**

  - Like and comment on blogs
  - Like and reply to comments
  - Bookmark blogs for later reading

- **User Engagement**

  - Follow and unfollow users

- **Admin Dashboard**

  - Manage reported blogs
  - Moderate platform activity

## Tech Stack

- **Frontend:** React, React Router DOM, Tailwind CSS, Lucide-React, MUI
- **Backend:** Node.js, Express.js, MongoDB
- **Authentication:** JWT, Google OAuth
- **Other:** Docker (for deployment), Vite (for build optimization)

## Installation and Setup

### Prerequisites

- Node.js
- MongoDB

### Steps to Run Locally

1. **Clone the repository**

   ```sh
   git clone https://github.com/yourusername/BlogHorizon.git
   cd BlogHorizon
   ```

2. **Backend Setup**

   ```sh
   cd backend
   npm install
   npm start
   ```

3. **Frontend Setup**

   ```sh
   cd frontend
   npm install
   npm run dev
   ```

4. **Environment Variables**
   Create a `.env` file in both `frontend` and `backend` directories with the necessary configurations (e.g., JWT secret, MongoDB URI, Google OAuth credentials).

## API Endpoints (Backend)

| Method | Endpoint                 | Description         |
| ------ | ------------------------ | ------------------- |
| POST   | /api/auth/register       | Register a new user |
| POST   | /api/auth/login          | Login user          |
| GET    | /api/blogs               | Fetch all blogs     |
| POST   | /api/blogs               | Create a new blog   |
| PUT    | /api/blogs/\:id          | Update blog         |
| DELETE | /api/blogs/\:id          | Delete blog         |
| POST   | /api/blogs/\:id/like     | Like a blog         |
| POST   | /api/blogs/\:id/comment  | Comment on a blog   |
| POST   | /api/comments/\:id/like  | Like a comment      |
| POST   | /api/comments/\:id/reply | Reply to a comment  |
| POST   | /api/blogs/\:id/report   | Report a blog       |

## Deployment

You can deploy BlogHorizon using Docker:

```sh
# Build and run the container
docker-compose up --build
```

Alternatively, deploy on platforms like Vercel (frontend) and Render/Heroku (backend).

## Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request.

## License

MIT License

give markdown of this README.md
