# Waste Management System

A full-stack waste management platform with citizen and admin roles, complaint tracking, pickup requests, notifications, and a responsive eco-friendly frontend.

## Quick start

1. Install dependencies:
   npm install
2. Start the app:
   npm run dev
3. Open the client at http://localhost:5173
4. Backend runs on http://localhost:5000

## Environment

Create a `.env` file in the server directory with:

PORT=5000
JWT_SECRET=change_me
DB_URI=mongodb://127.0.0.1:27017/waste_management

The app expects a running MongoDB instance. If you do not have MongoDB installed locally, install MongoDB Community Server or use a MongoDB Atlas connection string for `DB_URI`.
