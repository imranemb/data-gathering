import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NEON_DATABASE_URL);

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.status(405).json({ success: false, message: 'Méthode non autorisée' });
    return;
  }

  try {
    const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
    const { email, message, plan, platform } = body ?? {};

    if (!email) {
      response.status(400).json({ success: false, message: 'Adresse e-mail requise.' });
      return;
    }

    const normalizedPlan = plan ?? null;
    const normalizedMessage = message?.trim() ? message.trim() : null;
    const normalizedPlatform = platform ?? null;

    await sql`
      INSERT INTO early_access_signups (email, message, plan, platform, submitted_at)
      VALUES (${email}, ${normalizedMessage}, ${normalizedPlan}, ${normalizedPlatform}, NOW())
    `;

    response.status(200).json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde dans Neon:', error);
    response.status(500).json({ success: false, message: 'Une erreur est survenue.' });
  }
}

