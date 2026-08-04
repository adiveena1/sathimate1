/**
 * Firebase Admin initialisation for self-hosted (Hostinger VPS) deployments.
 *
 * On Google-managed hosting `admin.initializeApp()` picks up credentials
 * automatically. On our own VPS there is no metadata server, so credentials
 * must come from the environment. Supported (in order):
 *
 *   1. FIREBASE_SERVICE_ACCOUNT_BASE64  - base64 of the whole service-account JSON (recommended)
 *   2. FIREBASE_SERVICE_ACCOUNT_JSON    - raw service-account JSON in one line
 *   3. GOOGLE_APPLICATION_CREDENTIALS   - absolute path to the JSON file on the server
 */

let cached: typeof import('firebase-admin') | null = null;

function loadServiceAccount(): Record<string, unknown> | null {
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  if (b64) {
    return JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
  }

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (raw) {
    return JSON.parse(raw);
  }

  return null;
}

export async function getAdmin() {
  if (cached) return cached;

  const admin = await import('firebase-admin');

  if (!admin.apps.length) {
    const serviceAccount = loadServiceAccount();

    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as never),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      // File path on disk — applicationDefault() reads it.
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    } else {
      throw new Error(
        'Firebase Admin credentials missing. Set FIREBASE_SERVICE_ACCOUNT_BASE64 in .env.production on the server.'
      );
    }
  }

  cached = admin;
  return admin;
}
