import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit(): void {
    if (admin.apps.length > 0) return;

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (base64) {
      const decoded = Buffer.from(base64, 'base64').toString('utf8');
      const json = JSON.parse(decoded);
      admin.initializeApp({
        credential: admin.credential.cert(json as admin.ServiceAccount),
      });
      return;
    }

    if (!projectId || !clientEmail || !privateKey) {
      // Not configured; skip initialization
      return;
    }

    // Normalize formatting issues (wrap quotes and escaped newlines)
    try {
      const pkRaw = privateKey ?? '';
      privateKey = pkRaw
        .replace(/^"(.*)"$/s, '$1')
        .replace(/^'(.*)'$/s, '$1')
        .replace(/\\r\\n/g, '\n')
        .replace(/\\n/g, '\n');
      // If PEM header not found, attempt base64 decode fallback
      if (!privateKey.includes('BEGIN PRIVATE KEY')) {
        try {
          const decoded = Buffer.from(privateKey, 'base64').toString('utf8');
          if (decoded.includes('BEGIN PRIVATE KEY')) {
            privateKey = decoded;
          }
        } catch {}
      }

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } catch (err) {
      // Do not crash app; log clear guidance instead
      // eslint-disable-next-line no-console
      console.error('Failed to initialize Firebase Admin. Verify FIREBASE_PRIVATE_KEY formatting. If using .env, ensure newlines are escaped as \\n or use FIREBASE_SERVICE_ACCOUNT_BASE64. Error:', err);
    }
  }

  async verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
    if (admin.apps.length === 0) {
      throw new Error('Firebase is not configured on the server');
    }
    return admin.auth().verifyIdToken(idToken);
  }
}


