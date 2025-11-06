# FitTrack API 🏋️‍♂️

A comprehensive RESTful API for fitness tracking and workout management built with Node.js, Express, TypeScript, and MongoDB.

## 📋 Overview

FitTrack is a full-featured fitness tracking platform that enables users to monitor their workouts, set fitness goals, track body metrics, and manage progress photos. The system supports both regular users and administrators with role-based access control.

## ✨ Key Features

- **User Management**: Registration, email verification, and profile management
- **Admin Panel**: Dedicated admin controls for user and content management
- **Exercise Library**: Comprehensive database of exercises with muscle group targeting
- **Workout Plans**: Create and manage structured workout routines
- **Workout Sessions**: Log completed workouts with detailed set/rep tracking
- **Goal Tracking**: Set and monitor fitness goals (weight, strength, endurance, etc.)
- **Metric Entries**: Track body measurements and health metrics over time
- **Progress Photos**: Upload and organize transformation photos
- **Blog System**: Content management for fitness articles and guides
- **Image Management**: Cloudinary integration for media storage

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with native driver
- **Authentication**: JWT (Access & Refresh tokens)
- **Validation**: Joi
- **Image Storage**: Cloudinary
- **File Upload**: Multer
- **Email Service**: Brevo (formerly Sendinblue)
- **Security**: bcrypt for password hashing, HTTP-only cookies

## 📁 Project Structure

```
src/
├── configs/          # Configuration files (DB, CORS, Cloudinary)
├── controllers/      # Route controllers
├── models/          # Database models and schemas
├── services/        # Business logic layer
├── routes/          # API route definitions
├── middlewares/     # Auth & error handling
├── providers/       # External service integrations
├── validations/     # Request validation schemas
├── types/           # TypeScript type definitions
└── utils/           # Helper functions and constants
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB
- Cloudinary account
- Brevo API key

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd fittrack-api
```

2. Install dependencies

```bash
npm install
```

3. Create `.env` file

```env
LOCAL_APP_PORT=8080
LOCAL_APP_HOST=localhost
BUILD_MODE=dev
AUTHOR_NAME=Your Name
MONGODB_URI=your_mongodb_connection_string
DATABASE_NAME=fittrack
WEBSITE_DOMAIN_PRODUCTION=https://yourdomain.com
WEBSITE_DOMAIN_DEVELOPMENT=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
BREVO_API_KEY=your_brevo_key
ADMIN_EMAIL_ADDRESS=admin@example.com
ADMIN_EMAIL_NAME=FitTrack Admin
ACCESS_TOKEN_SECRET_SIGNATURE=your_secret
REFRESH_TOKEN_SECRET_SIGNATURE=your_secret
ACCESS_TOKEN_LIFE=14d
REFRESH_TOKEN_LIFE=14d
ADMIN_CREATION_SECRET_KEY=your_admin_key
```

4. Start the server

```bash
npm run dev
```

## 📚 API Endpoints

### Authentication

- `POST /v1/auth/login` - User/Admin login
- `POST /v1/auth/logout` - Logout
- `POST /v1/auth/refresh-token` - Refresh access token

### Users

- `POST /v1/users/register` - Register new user
- `POST /v1/users/verify` - Verify email
- `GET /v1/users/profile` - Get user profile (Protected)
- `PUT /v1/users/profile` - Update user profile (Protected)

### Admins

- `POST /v1/admins/register` - Register admin (requires secret key)
- `POST /v1/admins/verify` - Verify admin email
- `GET /v1/admins/profile` - Get admin profile (Protected, Admin only)
- `PUT /v1/admins/profile` - Update admin profile (Protected, Admin only)
- `GET /v1/admins/users` - Get all users (Protected, Admin only)
- `PUT /v1/admins/users/:id` - Update user (Protected, Admin only)
- `DELETE /v1/admins/users/:id` - Delete user (Protected, Admin only)

### Muscle Groups

- `GET /v1/muscle-groups` - Get all muscle groups
- `GET /v1/muscle-groups/:id` - Get muscle group by ID
- `POST /v1/muscle-groups` - Create muscle group (Protected, Admin only)
- `PUT /v1/muscle-groups/:id` - Update muscle group (Protected, Admin only)
- `DELETE /v1/muscle-groups/:id` - Delete muscle group (Protected, Admin only)

### Exercises

- `GET /v1/exercises` - Get all exercises (with filters)
- `GET /v1/exercises/:id` - Get exercise by ID
- `POST /v1/exercises` - Create exercise (Protected, Admin only)
- `PUT /v1/exercises/:id` - Update exercise (Protected, Admin only)
- `DELETE /v1/exercises/:id` - Delete exercise (Protected, Admin only)

### Workout Plans

- `GET /v1/workout-plans` - Get user's workout plans (Protected)
- `GET /v1/workout-plans/:id` - Get workout plan by ID (Protected)
- `POST /v1/workout-plans` - Create workout plan (Protected)
- `PUT /v1/workout-plans/:id` - Update workout plan (Protected)
- `DELETE /v1/workout-plans/:id` - Delete workout plan (Protected)

### Workout Sessions

- `GET /v1/workout-sessions` - Get user's workout sessions (Protected)
- `GET /v1/workout-sessions/:id` - Get workout session by ID (Protected)
- `POST /v1/workout-sessions` - Log workout session (Protected)
- `PUT /v1/workout-sessions/:id` - Update session (Protected)
- `DELETE /v1/workout-sessions/:id` - Delete session (Protected)

### Metric Entries

- `GET /v1/metric-entries` - Get user's metric entries (Protected)
- `GET /v1/metric-entries/:id` - Get metric entry by ID (Protected)
- `POST /v1/metric-entries` - Create metric entry (Protected)
- `PUT /v1/metric-entries/:id` - Update metric entry (Protected)
- `DELETE /v1/metric-entries/:id` - Delete metric entry (Protected)

### Goals

- `GET /v1/goals` - Get user's goals (Protected)
- `GET /v1/goals/:id` - Get goal by ID (Protected)
- `POST /v1/goals` - Create goal (Protected)
- `PUT /v1/goals/:id` - Update goal (Protected)
- `DELETE /v1/goals/:id` - Delete goal (Protected)

### Progress Photos

- `GET /v1/progress-photos` - Get user's progress photos (Protected)
- `GET /v1/progress-photos/:id` - Get progress photo by ID (Protected)
- `POST /v1/progress-photos` - Upload progress photo (Protected)
- `PUT /v1/progress-photos/:id` - Update progress photo (Protected)
- `DELETE /v1/progress-photos/:id` - Delete progress photo (Protected)

### Blogs

- `GET /v1/blogs` - Get all blogs
- `GET /v1/blogs/:id` - Get blog by ID
- `POST /v1/blogs` - Create blog (Protected, Admin only)
- `PUT /v1/blogs/:id` - Update blog (Protected, Admin only)
- `DELETE /v1/blogs/:id` - Delete blog (Protected, Admin only)

## 🔒 Authentication & Authorization

- JWT-based authentication with access and refresh tokens
- HTTP-only cookies for token storage
- Role-based access control (Admin/Member)
- Protected routes with middleware validation
- Automatic token refresh mechanism
- Email verification system

## 🎨 Features Highlight

### Muscle Groups & Exercise Targeting

- Primary and secondary muscle group classification
- Filter exercises by muscle groups, type, and difficulty
- Rich exercise metadata (video URLs, images, equipment)
- Public and private exercise visibility

### Advanced Workout Planning

- Multi-day workout schedules (Monday-Sunday)
- Exercise ordering and rest periods
- Target sets, reps, and weight specifications
- Tempo and RPE (Rate of Perceived Exertion) tracking
- Flexible workout plan duration

### Comprehensive Tracking

- Multiple metric types (weight, height, body fat, muscle mass, BMI, etc.)
- Progress photo organization (front/side/back views)
- Goal setting with status tracking (active/achieved/abandoned)
- Historical data analysis with date range filters
- Detailed workout session logging with sets, reps, and weights

### Image Management

- Cloudinary integration for scalable media storage
- Automatic image optimization and transformation
- Support for user avatars, exercise images, muscle group images, and progress photos
- Secure image deletion on resource removal

## 📊 Database Schema

The application uses MongoDB with the following main collections:

- `users` - User accounts and profiles
- `admins` - Administrator accounts
- `muscle_groups` - Exercise muscle group categories
- `exercises` - Exercise library
- `workout_plans` - User workout plans
- `workout_sessions` - Logged workout sessions
- `metric_entries` - Body measurements and metrics
- `goals` - User fitness goals
- `progress_photos` - Progress transformation photos
- `blogs` - Fitness articles and content

## 🔐 Security Features

- Password hashing with bcrypt (salt rounds: 8)
- JWT token-based authentication
- HTTP-only secure cookies
- CORS configuration with whitelist domains
- Input validation with Joi schemas
- Role-based access control
- Secure file upload validation
- Environment variable configuration

## 👨‍💻 Author

Built with ❤️ for fitness enthusiasts

---

**Note**: This API requires proper environment configuration and external service credentials (MongoDB, Cloudinary, Brevo) to function correctly.
