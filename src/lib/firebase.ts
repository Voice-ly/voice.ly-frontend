import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

/**
 * Firebase configuration object, loaded from environment variables.
 *
 * These values are injected at build time using Vite's `import.meta.env`.
 * Make sure your `.env` file contains the proper Firebase keys.
 *
 * @type {Object}
 * @property {string} projectId - The Firebase project ID.
 * @property {string} apiKey - API key used to authenticate requests.
 * @property {string} authDomain - Authentication domain of the Firebase project.
 * @property {string} storageBucket - Storage bucket used for file uploads.
 * @property {string} messagingSenderId - Sender ID for Firebase Cloud Messaging.
 * @property {string} appId - Unique Firebase application identifier.
 * @property {string} measurementId - Analytics measurement identifier.
 */

const firebaseConfig = {
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_TO,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.MEASUREMENT_ID,
};

/**
 * Initializes the Firebase application using the provided configuration.
 *
 * @constant
 * @type {import("firebase/app").FirebaseApp}
 */

const app = initializeApp(firebaseConfig);

/**
 * Firebase Authentication instance used throughout the application.
 *
 * @constant
 * @type {import("firebase/auth").Auth}
 */

export const auth = getAuth(app);

export default app;
