# Project: File Uploader

In this project, we’ll be building a stripped down version of Google Drive (or any other personal storage service).

Project 👉 (Live Preview)[https://chip-maple-stargazer.glitch.me/]

Build an stripped down version of Google Drive (or any other personal storage service).
User can make folders and upload and download pdf files from those folders. User can create public folder to share files with friends.

This project is part of [The Odin Project](https://www.theodinproject.com/lessons/nodejs-file-uploader) curriculum.

Goal of this project is practice building express apps, adding authentication and using typescript as additional learning layer.

## Technologies used

- Node.js
- Express
- Typescript
- Ejs template
- Tailwind Css
- Prisma with PostgreSQL
- Supabase Storage
- Auth with passport, passport-local, express-session, express-validation, bcrypt

## Screenshots

### Homepage

![Home page.](/src/public/screenshots/screenshot-home.png "This is a sample image.")

### Dashboard

![Dashboard page.](/src/public/screenshots/screenshot-dashboard.png "This is a sample image.")

### Register user

![Register user page.](/src/public/screenshots/screenshot-signup.png "This is a sample image.")

### Upload file form

![Activate member code.](/src/public/screenshots/screenshot-file-upload.png "This is a sample image.")

### Confirm box

![Activate member code.](/src/public/screenshots/screenshot-confirm-box.png "This is a sample image.")

## Installing and starting project

1.  Clone or fork this repo
2.  cd into the members-only directory (where this README is located).
3.  Create .env file and add

- PORT to 5000,
- DATABASE_URI variable with your postgresql connection link for prisma,
- COOKIE_SECRET hash string for cookie secret,
- SUPABASE_PROJECT_URL and SUPABASE_ANON_KEY after setting up new supabase project

4.  run project with npm run dev
5.  visit http://localhost:5000 and have fun
