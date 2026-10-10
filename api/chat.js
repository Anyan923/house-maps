// api/chat.js — Vercel Serverless Function
// Reenvía peticiones del cliente a Claude Haiku.
// La API key vive como variable de entorno ANTHROPIC_API_KEY en Vercel.

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { prompt, context } = req.body || {};
  if (!prompt || typeof prompt !== 'string') return res.status(400).json({ error: 'Falta el prompt' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API no configurada' });

  try {
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        system: context || 'Eres un asistente familiar cálido, práctico, con valores cristianos. Responde corto y útil.',
        messages: [{ role: 'user', content: prompt }]
      })
    });
    if (!claudeRes.ok) {
      const errText = await claudeRes.text();
      return res.status(claudeRes.status).json({ error: 'Error Claude', detail: errText.slice(0, 200) });
    }
    const data = await claudeRes.json();
    return res.status(200).json({ text: data.content?.[0]?.text || '' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
