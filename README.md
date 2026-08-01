# TalentHub

TalentHub is a full-stack AI-powered job portal that connects applicants with recruiters. Applicants can discover and apply for jobs, manage their profiles, and prepare for interviews with an AI Interview Coach, while recruiters can publish jobs, manage applications, shortlist candidates, and streamline hiring.

[Live Demo](https://talenthubb.vercel.app/)

---

## Quick Start

```bash
git clone https://github.com/NagaaSaketh/TalentHub.git
cd TalentHub
npm install
npm run dev
```

> Backend runs separately.

---

## Environment Variables

### Frontend

```env
VITE_API_URL=your_backend_url
```

### Backend

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GROQ_API_KEY=your_gemini_api_key
```

---

## Technologies

### Frontend

- React
- React Router DOM
- Redux Toolkit
- Axios
- Tailwind CSS
- DaisyUI
- Framer Motion
- Lucide React for icons

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- Cloudinary
- GROQ API

### Deployment

- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas
- Cloudinary

---

## Features

### Authentication

- Applicant and Recruiter registration
- Secure JWT authentication using HTTP-only cookies
- Protected routes based on user roles
- Persistent login sessions
- Forgot password functionality

### Applicant Portal

- Browse all available job listings
- Advanced search and filtering
- View complete job details
- Apply for jobs
- Track application status
- Personalized dashboard with statistics
- Recent application activity timeline
- Recommended jobs section
- Update profile information
- Upload profile photo and resume
- AI Interview Coach for shortlisted applications

### Recruiter Portal

- Publish new job openings
- Edit job postings
- Archive jobs
- Recruiter analytics dashboard
- View recent applications
- Manage all applications
- Shortlist or reject applicants
- Recruiter profile management
- Upload company logo
- AI Assistant for recruiter workflows

### AI Features

- AI Hiring Assistant (Recruiter) — ask natural-language questions about applicants (e.g. "top 3 candidates", "who should I interview first?"); answers strictly from stored applicant/application data, considering only Shortlisted candidates for interview-priority questions.
- AI Interview Coach (Applicant) — generates job-specific interview prep (5 likely questions, topics to revise, preparation tips) for a given application, available only for Applied or Shortlisted status.
- Powered by: Groq (Llama 3.3 70B).

### File Uploads

- Resume upload (PDF)
- Applicant profile photo upload
- Recruiter company logo upload
- Cloudinary integration for cloud storage

### User Experience

- Responsive design
- Lazy-loaded pages
- Animated UI with Framer Motion
- Empty state illustrations and onboarding messages
- Toast notifications
- Loading indicators
- Custom 404 page

---

## Authentication Flow

1. User registers as an Applicant or Recruiter.
2. Password is securely hashed using bcrypt.
3. User logs in with email and password.
4. Backend generates a JWT token.
5. JWT is stored in an HTTP-only cookie.
6. Protected routes validate the authenticated user.
7. Redux stores the authenticated user and profile information.
8. Users remain logged in until logout or token expiration.

---

## API Reference

### Authentication

`POST /register`

Register a new applicant or recruiter.

```
Request:
multipart/form-data

fullname
email
password
role
resume/companyLogo
```

---

`POST /login`

```
Request:
{
  email,
  password
}

Response:
{
  message
}
```

---

`POST /logout`

Logs out the current user.

---

`GET /me`

Returns the currently authenticated user.

---

`PUT /forgot-password`

Reset account password.

```
Request:
{
  email,
  password,
  confirmPassword
}
```

---

### Applicant

`GET /jobs`

Fetch all active jobs.

---

`GET /jobs/:id`

Fetch a single job.

---

`POST /jobs/:id/apply`

Apply for a job.

---

`PATCH /applicant/profile`

Update applicant profile.

---

`PATCH /applicant/profile/photo`

Upload applicant profile photo.

---

`PATCH /applicant/profile/resume`

Upload applicant resume.

---

`GET /applicant/dashboard`

Fetch applicant dashboard statistics and recent activity.

---

### Recruiter

`POST /recruiter/jobs`

Publish a new job.

---

`GET /recruiter/jobs`

Fetch all recruiter jobs.

---

`PATCH /recruiter/jobs/:id`

Update job details.

---

`PATCH /recruiter/jobs/:id/archive`

Archive a job posting.

---

`GET /recruiter/dashboard`

Fetch recruiter dashboard statistics.

---

`GET /recruiter/applications`

Fetch all received applications.

---

`PATCH /recruiter/profile`

Update recruiter profile.

---

`PATCH /recruiter/profile/logo`

Upload company logo.

---

### AI

- `POST /ai/applicant/guide/:jobId`

Generate AI interview preparation based on the selected job.

```
Request:
{
  jobId
}

Response:
{
    questions,
    topicsToRevise,
    preparationTips
}
```

---

- `POST /ai/recruiter/chat`

Ask the AI Hiring Assistant a question about applicants across all jobs posted by the logged-in recruiter.

```
Request:
{
prompt
}

Response:
{
answer
}

```

---

## Project Structure

```
src/
├── api/
├── assets/
├── components/
│   ├── applicant/
│   └── recruiter/
├── pages/
│   ├── applicant/
│   ├── recruiter/
│   └── auth/
├── utils/
│   ├── applicant/
│   ├── recruiter/
│   └── auth/
├── store.js
├── App.jsx
└── main.jsx
```

---

## Bonus Feature

- Resume Upload

---

## Contact

For bugs or feature requests, reach out to:

**Vadlamani Saketh**

📧 vadlamanisaketh25@gmail.com
