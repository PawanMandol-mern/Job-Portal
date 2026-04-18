# Job Portal Web Application

A full-stack Job Portal web application built using the MERN stack. This platform allows users to explore job opportunities, apply for jobs, and enables recruiters to post and manage job listings.

---

##  Features

###  User (Job Seeker)

* Register & Login with secure authentication (JWT + Cookies)
* Browse available jobs
* Apply for jobs
* View applied jobs

###  Recruiter

* Post new job listings
* Manage job postings
* View applicants

###  Authentication System

* Email OTP verification during registration
* Secure login with JWT
* Password reset using OTP (Forgot Password feature)

---

##  Tech Stack

### Frontend

* React.js (Vite)
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB (Mongoose)

### Other Tools

* JWT Authentication
* Bcrypt (Password hashing)
* Cloudinary (Image upload)
* Stripe (Payment integration)

---

##  Project Structure

```
BACKEND/
├── Controllers/
├── middleware/
├── Module/
├── routes/
├── utils/
├── Config/
├── index.js

FRONTEND/
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
```

---

##  API Flow

1. User registers → OTP sent to email
2. User verifies OTP
3. User completes registration
4. Login → JWT token stored in cookies
5. Protected routes accessed via middleware

---

##  Environment Variables

Create a `.env` file in the backend:

```
PORT=3000
MONGO_URI=your_mongodb_url
JWT_SECRET_KEY=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

---

##  Run Locally

### Backend

```
cd backend
npm install
npm run dev
```

### Frontend

```
cd frontend
npm install
npm run dev
```

---

##  Deployment

* Backend: Render / Railway
* Frontend: Vercel

---

## Future Improvements

* Real-time notifications using Socket.IO
* Video interview feature (WebRTC)
* Resume upload system
* Admin dashboard

---

## Author

**Pawan Kumar**
Final Year BCA Student
Aspiring Full Stack Developer

---

## Note

This project is built for learning and demonstration purposes.
Feel free to explore and contribute.

---
