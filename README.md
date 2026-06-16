# ReHabit

ReHabit is a mobile habit-tracking app for creating, completing, and analyzing personal habits. The project is split into an Expo/React Native frontend and a Node.js/Express backend backed by MongoDB.

## Features

- User registration and JWT-based authentication.
- Create habits for building positive routines or quitting unwanted behaviors.
- Configure habit title, description, icon, color, start date, end date, and schedule.
- Supported schedules: daily, weekly, or custom days of the week.
- Mark habits as completed for a selected date.
- Calendar view with visual completion status.
- Statistics screen with current streak, longest streak, completion rate, and recent activity chart.
- User profile management, profile photo support, and light/dark theme switching.

## Tech Stack

### Frontend

- Expo 54
- React Native 0.81
- Expo Router
- TypeScript
- Zustand
- Axios
- React Hook Form, Zod
- React Native Chart Kit
- Lucide React Native

### Backend

- Node.js
- Express 5
- MongoDB, Mongoose
- JWT
- bcryptjs
- dotenv
- cors

## Project Structure

```text
ReHabit/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── middleware/      # JWT middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── app/             # Expo Router screens and navigation
│   ├── components/      # UI components
│   ├── constants/       # Theme, colors, habit presets
│   ├── hooks/
│   ├── src/
│   │   ├── context/     # Auth context
│   │   ├── services/    # API clients
│   │   ├── store/       # Zustand stores
│   │   ├── utils/
│   │   └── validation/
│   ├── app.json
│   └── package.json
└── README.md
```

## Requirements

- Node.js 20 or newer
- npm
- MongoDB Atlas or a local MongoDB instance
- Expo Go on a physical device, or an Android/iOS emulator

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd ReHabit
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
```

Start the backend server:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:5000
```

### 3. Set up the frontend

Open another terminal:

```bash
cd frontend
npm install
npm start
```

After Expo starts, you can open the app in Expo Go, an Android emulator, an iOS simulator, or the web version.

> `frontend/src/services/api.js` currently points to the deployed API at `https://rehabit-jdci.onrender.com/`. For local development, change `baseURL` to your local backend URL, for example `http://localhost:5000/`.

## Available Scripts

### Backend

```bash
npm start      # start server.js
npm run dev    # start with nodemon
```

### Frontend

```bash
npm start      # start Expo
npm run android
npm run ios
npm run web
npm run lint
```

## API Overview

Most routes, except registration and login, require the following header:

```text
Authorization: Bearer <token>
```

### Auth

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Log in a user |
| GET | `/auth/me` | Get the current user |
| PATCH | `/auth/me` | Update username or email |
| PATCH | `/auth/me/photo` | Update profile photo |

### Habits

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/habits` | Get the user's habits |
| POST | `/habits` | Create a habit |
| PUT | `/habits/:id` | Update a habit |
| DELETE | `/habits/:id` | Delete a habit and its logs |
| GET | `/habits/today` | Get habits active today |

### Logs

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/logs?month=YYYY-MM` | Get completion logs for a month |
| POST | `/logs/:habitId/complete` | Mark a habit as completed |
| DELETE | `/logs/:habitId/complete` | Mark a habit as incomplete |
| GET | `/logs/habit/:habitId/logs` | Get all logs for a specific habit |

### Statistics

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/statistics` | Get streaks, completion rate, and daily completion data |

## Data Models

### User

- `username`
- `email`
- `passwordHash`
- `photoUri`
- `createdAt`

### Habit

- `userId`
- `title`
- `description`
- `icon`
- `color`
- `type`: `build` or `quit`
- `frequency`: `daily`, `weekly`, or `custom`
- `daysOfTheWeek`
- `weeklyDay`
- `activeFrom`
- `activeTo`
- `createdAt`

### HabitLog

- `habitId`
- `userId`
- `date`
- `completed`

## Quality Checks

The frontend includes a lint script:

```bash
cd frontend
npm run lint
```

Automated tests are not configured yet.

## Development Notes

- Passwords are stored as bcrypt hashes.
- JWT tokens expire after 7 days.
- Habit logs have a unique index on `habitId`, `userId`, and `date`.
- Deleting a habit also deletes its related logs.

## Future Improvements

- Add automated tests for backend routes, authentication, habit scheduling, and statistics calculations.
- Add frontend tests for key user flows such as registration, login, habit creation, completion, and calendar filtering.
- Implement full account deletion from the profile screen.
- Improve error handling and loading states across the mobile app.
- Add password reset and email verification flows.
- Add push notifications and habit reminders.
- Add more detailed analytics, such as weekly/monthly summaries and habit-specific progress charts.

