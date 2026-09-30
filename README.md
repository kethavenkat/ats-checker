# ATS Checker – AI Resume Analyzer & Job Match Engine

ATS Checker is a production-grade full-stack web application designed to help job seekers optimize their resumes for modern Applicant Tracking Systems (ATS), identify missing skills, compare resumes directly against job descriptions, and obtain actionable, truthful suggestions for improvement.

---

## 1. Project Overview

Modern hiring processes rely on automated ATS filters to rank candidates before recruiters view submissions. ATS Checker provides:
- **0–100 ATS Compatibility Scoring** across 7 weighted dimensions (Formatting, Keywords, Skills, Experience, Structure, Contact Information, Readability).
- **ATS Compliance Checks**: Instant PASS / WARNING / NEEDS IMPROVEMENT flags on tables, single-column scans, measurable achievements, and header conventions.
- **Direct Resume & Job Description Comparison**: Provide both a resume and job description to get instant match scoring, missing keyword analysis, and tailored bullet point rewrites.
- **Truthful Bullet Point Rewrites**: Actionable revisions strictly grounded in documented achievements, adhering to a strict zero-fabrication policy.
- **Document Management**: Multi-format support (PDF, DOCX, DOC, TXT) with private storage and revision history.

---

## 2. Technologies Used

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React icons
- **Routing**: React Router v7
- **Backend**: Node.js & Express server with TypeScript runtime (`tsx`)
- **AI Engine**: Google Gemini API (`@google/genai` TypeScript SDK with `gemini-3.8-flash`)
- **Document Processing**: `mammoth` (DOCX parsing), multipart upload streaming
- **Persistence & Cloud**: Firebase Authentication, Cloud Firestore (with `firebase-blueprint.json` schema and ABAC `firestore.rules`), with resilient local fallback for instant zero-config testing.

---

## 3. How to Install Dependencies

```bash
# Install all required packages
npm install
```

---

## 4. How to Configure Firebase

ResumeAI supports Firebase Authentication and Cloud Firestore:
1. Create a project in the [Firebase Console](https://console.firebase.google.com).
2. Register a Web App under Project Settings and copy the configuration keys.
3. Enable **Email/Password** authentication in the **Authentication > Sign-in method** tab.
4. Create a Firestore Database in **Production Mode**.
5. Add the keys to your environment file (`.env` or AI Studio Secrets).

---

## 5. How to Configure Google Gemini API

ResumeAI uses Google Gemini server-side via the `@google/genai` SDK:
1. Obtain an API key from [Google AI Studio](https://aistudio.google.com/).
2. In AI Studio Build, the key is automatically injected into `process.env.GEMINI_API_KEY`.
3. For local development, set `GEMINI_API_KEY="your_api_key_here"` in your `.env` file.

---

## 6. Environment Variables

Create a `.env` file at the project root based on `.env.example`:

```bash
# Gemini API Key (Server-Side)
GEMINI_API_KEY="your_gemini_api_key"

# Port (Defaults to 3000)
PORT=3000

# Optional Firebase Client Configuration (if connecting to live Firebase)
VITE_FIREBASE_API_KEY=""
VITE_FIREBASE_PROJECT_ID=""
VITE_FIREBASE_MESSAGING_SENDER_ID=""
VITE_FIREBASE_APP_ID=""
```

---

## 7. How to Run Locally

```bash
# Start full-stack development server on port 3000
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 8. How to Build for Production

```bash
# Compile client assets
npm run build

# Start production server
npm start
```

---

## 9. Firebase Authentication Setup

1. In Firebase Console, go to **Authentication**.
2. Click **Get Started** and enable **Email/Password**.
3. (Optional) Enable **Google Sign-In** provider.
4. Users can register at `/signup`, log in at `/login`, or click **Quick Demo** to explore pre-populated resumes.

---

## 10. Firestore Setup & Security Rules

ResumeAI includes hardened security rules (`firestore.rules`) and blueprint data definitions (`firebase-blueprint.json`):
- Collections:
  - `/users/{userId}`: User profile information restricted to the document owner.
  - `/resumes/{resumeId}`: Uploaded resumes accessible only by the authenticated owner.
  - `/analyses/{analysisId}`: Detailed ATS analysis reports, read-only and immutable.
  - `/jobMatches/{matchId}`: Job comparison records.
  - `/contactMessages/{messageId}`: Inquiries sent via the contact form.
  - `/feedback/{feedbackId}`: User satisfaction ratings and comments.

Deploy rules to your Firebase project:
```bash
firebase deploy --only firestore:rules
```

---

## 11. Firebase Storage Setup

If saving raw PDF binaries to Cloud Storage:
1. Go to **Storage** in Firebase Console.
2. Ensure storage rules restrict access:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /resumes/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 12. Deployment Instructions

1. **Google Cloud Run / AI Studio**: The project is structured with a root `server.ts` configured to run on port 3000.
2. Build command: `npm run build`
3. Start command: `npm start`
4. Ensure `GEMINI_API_KEY` is added to your environment secrets.
