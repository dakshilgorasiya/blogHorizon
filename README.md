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
  - Remove inappropriate blogs

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
   npm run dev
   ```

3. **Frontend Setup**
   ```sh
   cd frontend
   npm install
   npm run dev
   ```

4. **Environment Variables**
   Create a `.env` file in both `frontend` and `backend` directories with the necessary configurations (Same format as given in .env.sample).

## API Endpoints (Backend)

### User Endpoints
| Method | Endpoint                        | Description               |
|--------|--------------------------------|---------------------------|
| POST   | /api/v1/user/register          | Register a new user       |
| POST   | /api/v1/user/login             | Login user                |
| POST   | /api/v1/user/renew-access-token| Renew access token        |
| POST   | /api/v1/user/forgot-password   | Initiate password reset   |
| POST   | /api/v1/user/reset-password/:resetToken | Reset password |
| POST   | /api/v1/user/logout            | Logout user               |
| GET    | /api/v1/user/current-user      | Get current logged-in user |
| PATCH  | /api/v1/user/update-avatar     | Update profile avatar     |
| POST   | /api/v1/user/update-bio        | Update user bio           |
| POST   | /api/v1/user/makeBlogFavorite  | Mark a blog as favorite   |
| POST   | /api/v1/user/google-oauth      | Google OAuth login        |
| POST   | /api/v1/user/verify-otp        | Verify OTP                |
| POST   | /api/v1/user/profile-complete  | Complete user profile     |
| GET    | /api/v1/user/user-profile/:userId | Get user profile        |
| GET    | /api/v1/user/user-interests    | Get user interests        |

### Blog Endpoints
| Method | Endpoint                     | Description               |
|--------|------------------------------|---------------------------|
| POST   | /api/v1/blog/create-blog     | Create a new blog         |
| GET    | /api/v1/blog/get-all-blogs   | Fetch all blogs           |
| GET    | /api/v1/blog/get-blog-by-id/:id | Fetch blog by ID       |
| PUT    | /api/v1/blog/update-blog/:blogId | Update a blog         |
| DELETE | /api/v1/blog/delete-blog/:blogId | Delete a blog         |
| GET    | /api/v1/blog/get-favoriteblogs | Get favorite blogs    |
| GET    | /api/v1/blog/getInterests    | Get blog interests        |
| GET    | /api/v1/blog/get-blog-by-category | Get blogs by category |
| GET    | /api/v1/blog/get-blog-title/:id | Get blog title by ID |
| GET    | /api/v1/blog/search-blog     | Search blogs              |
| GET    | /api/v1/blog/search-blog-by-category | Search blogs by category |

### Comment Endpoints
| Method | Endpoint                    | Description               |
|--------|-----------------------------|---------------------------|
| POST   | /api/v1/comment/postComment | Post a comment on a blog  |
| GET    | /api/v1/comment/getAllComments | Get all comments      |

### Follow Endpoints
| Method | Endpoint                      | Description               |
|--------|--------------------------------|---------------------------|
| POST   | /api/v1/follow/toggle-follow  | Follow or unfollow a user |

### Like Endpoints
| Method | Endpoint                     | Description               |
|--------|------------------------------|---------------------------|
| POST   | /api/v1/like/toggle-like     | Like or unlike a blog/comment |
| GET    | /api/v1/like/get-likes       | Get likes count/details   |

### Report Endpoints
| Method | Endpoint                     | Description               |
|--------|------------------------------|---------------------------|
| POST   | /api/v1/report/create-report | Report a blog            |

### Admin Endpoints
| Method | Endpoint                                | Description                    |
|--------|----------------------------------------|--------------------------------|
| POST   | /api/v1/admin/get-all-reported-blogs  | Fetch all reported blogs       |
| GET    | /api/v1/admin/get-blog-by-id/:id      | Get a specific blog by ID      |
| GET    | /api/v1/admin/get-reports-by-blog-id/:id | Get reports for a blog    |
| POST   | /api/v1/admin/delete-blog            | Delete a reported blog         |
| PUT    | /api/v1/admin/mark-report-as-resolved/:id | Resolve a report        |
| GET    | /api/v1/admin/verify-admin           | Verify admin access            |

## Deployment

You can deploy BlogHorizon using Docker:

```sh
docker-compose up --build
```

Alternatively, deploy on platforms like Vercel (frontend) and Render/Heroku (backend).

## Contributing

Contributions are welcome! Feel free to fork the repo and submit a pull request.

