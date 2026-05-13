Setup (Local dev with Firebase emulators)

1. Install dependencies

   cd server
   npm install

2. Copy and edit `.env.example` -> `.env` if you want to set ADMIN_UID or provide FIREBASE_SERVICE_ACCOUNT JSON.

3. Start Firebase emulators (in a separate terminal)

   npx firebase emulators:start --only firestore,auth --project=eduverse-pro

4. Seed sample data (optional)

   npm run seed

5. Start server

   npm run dev

API Endpoints (examples)

- GET /health
- GET /tests
- GET /tests/:id
- POST /tests (admin; Bearer idToken)
- POST /sessions (Bearer idToken) -> { testId, state }
- GET /sessions/:testId (Bearer idToken)
- POST /results (Bearer idToken) -> { testId, score, details }
- POST /admin/createUser (admin)

Notes

- This project is configured to work with the Firebase emulators for local testing.
- For production you should configure a real Firebase project and provide service account credentials or environment variables.
- The admin auth check uses custom claim `admin: true` or ADMIN_UID env var for bootstrapping.
