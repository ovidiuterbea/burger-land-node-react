# Burger Land 🍔🍔🍔
<p align="center">
  <img src="https://github.com/user-attachments/assets/15d2a7d8-5e27-4d56-888e-896ea082fe17" alt="Flow_diagram"/>
</p>

<p align="center">
  <strong>Figure 1.</strong> High-level flow diagram showcasing how data and requests travel through the application.
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/7e46f2c7-09cd-40a2-ad5a-971cbbd23cd7" alt="Infrastructure_diagram"/>
</p>

<p align="center">
  <strong>Figure 2.</strong> Infrastructure diagram highlighting the major components and how they integrate in a production environment.
</p>

## Table of Contents
1. [Overview](#overview)
2. [Requirements](#requirements)
3. [Tech Stack](#tech-stack)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Pipelines (CI/CD)](#pipelines-cicd)
7. [Deployment & Infrastructure](#deployment--infrastructure)
   - [Solution 1: Netlify + Render.com](#solution-1-netlify--rendercom)
   - [Solution 2: Vercel (Node + React)](#solution-2-vercel-node--react)
   - [Solution 3: AWS ECS](#solution-3-aws-ecs)
8. [Monitoring](#monitoring)
9. [Security Considerations](#security-considerations)
   - [Password Security](#1-password-security)
   - [Token-Based Authentication](#2-token-based-authentication)
   - [Environment & Configuration Management](#3-environment-and-configuration-management)
   - [Route Protection & Access Control](#4-route-protection-and-access-control)
   - [Error Handling & Logging](#5-error-handling-and-logging)
   - [Secure Communication & Deployment](#6-secure-communication-and-deployment)
   - [Additional Considerations](#7-additional-considerations)

---

## Overview
**Burger Land** is a full-stack application built with **Node.js**, **Express**, **TypeScript**, **Prisma**, **React**, and **Vite**. It demonstrates how to set up a modern web application, including authentication, database management, and deployment considerations.

---

## Requirements
- **Node.js** (v18 or higher)
- **Docker** (Docker Desktop or Rancher Desktop)
- Any modern browser (for local testing and running the frontend)

---

## Tech Stack
- **Backend:** Node.js, TypeScript, Express, Prisma ORM, Docker
- **Frontend:** React.js, TypeScript, Vite, Vitest, React Testing Library

---

## Backend Setup
1. **Navigate to the `backend` folder**:
   ```bash
   cd backend
2. **Create an .env file and ensure these environment variables are set:**:
   ```bash
   DATABASE_URL="postgresql://someuser:somepassword@localhost:5432/burgerland"
   JWT_SECRET="your-super-secret-jwt-key"
3. **Install dependencies:**:
   ```bash
   npm install
4. **Generate the Prisma client:**:
   ```bash
   npx prisma generate
5. **Start the backend:**:
   ```bash
   npm start
6. **Open a new terminal (still in the backend folder) and apply migrations:**:
   ```bash
   npx prisma migrate dev
7. **(Optional) Use Prisma Studio: (Opens a web-based GUI to inspect and manage database tables and row)**:
   ```bash
   npx prisma studio

## Frontend Setup
1. **Navigate to the `frontend` folder**:
   ```bash
   cd frontend
2. **Install dependencies:**:
   ```bash
   npm install
3. **Start the development server:**:
   ```bash
   npm run dev
4. **Run unit tests (Vitest + React Testing Library):**:
   ```bash
   npm run test
5. **Check code coverage:**:
   ```bash
   npm run coverage

## Pipelines (CI/CD)
For pipelines, for both backend and frontend, I would use Github Actions, focusing on checking on the following things:

1.	Installing dependencies with npm install
2.	Linting of the application (eslint check)
3.	running tests with npm run test
4.	Checking if the build is fine using npm run build

## Deployment & Infrastructure
Currently, this app is intended to run locally (Node.js server + Dockerized DB). Below are some common deployment patterns:

1. Netlify + Render.com
Frontend: Deploy your static React build to Netlify.
Backend: Deploy your Node/Express app to Render.com.
Configure environment variables (e.g., DATABASE_URL, JWT_SECRET).
2. Vercel (Combined Node + React)
Deploy the entire app on Vercel.
Vercel supports Node.js APIs and static frontend hosting in a single project.
3. AWS ECS
Use AWS ECS for Dockerized applications if you want container orchestration without a full Kubernetes setup.
Combine ECS with a VPC (for networking) and Route53 (for DNS).
Frontend can be hosted on Amazon S3 + CloudFront (serving the static build).
Optionally use Amazon API Gateway to expose REST endpoints for your backend.

## Monitoring
For monitoring, I would use AWS CloudWatch to track resource usage, logs or alerts.

## Security Considerations

### 1. Password Security
- **Hashing with bcrypt**:
  - **Implementation**:
    - On user registration, hash the plain-text password using `bcrypt` (with ~10 salt rounds).
    - During login, compare the incoming password with the stored hash using `bcrypt.compare()`.
  - **Why?**  
    - Avoids storing passwords in plain text, mitigating risk in the event of a database breach.

### 2. Token-Based Authentication
- **JWT (JSON Web Token)**:
  - **Implementation**:
    - Upon successful login, generate a JWT using a secret (`JWT_SECRET`) stored in environment variables.
    - The client sends this token (often in the `Authorization` header: `Bearer <token>`) for protected endpoints.
  - **Considerations**:
    - Tokens should have an expiration time (e.g., 15 minutes to a few hours).
    - Optionally use refresh tokens for longer sessions.

### 3. Environment & Configuration Management
- **Environment Variables**:
  - **Implementation**:
    - Separate configs for dev, test, and production.

### 4. Route Protection & Access Control
- **Private/Protected Routes**:
  - **Frontend**:
    - Using a mechanism (React Router, ContextAPI, for example) to check a user’s auth state.  
    - Redirect unauthenticated users to a login page.
  - **Backend**:
    - Create middleware that checks for a valid JWT before allowing access to protected routes.  
    - Return `401 Unauthorized` or `403 Forbidden` when appropriate.

### 5. Error Handling & Logging
- **Centralized Error Handling**:
  - **Implementation**:
    - Return sanitized error messages to the client.

### 6. Secure Communication & Deployment
- **HTTPS**:
  - **Implementation**:
    - Use HTTPS in production to encrypt data in transit.
  - **Why?**  
    - Protects sensitive data (like tokens, passwords) from interception or tampering.

### 7. Additional Considerations
- **Rate Limiting & Brute Force Protection**:
  - Implement `express-rate-limit` (or similar) on login/signup routes to mitigate repeated login attempts.
- **CORS**:
  - Using the `cors` package in Express to allow requests only from trusted domains.
- **Session/Token Expiration**:
  - Enforce session/token expiration times, requiring users to re-authenticate periodically.
- **Logging & Monitoring**:
  - Track key security events (e.g., failed login attempts, suspicious requests).
  - Use cloud-based logging (e.g., AWS CloudWatch, Datadog) if scaling up.
