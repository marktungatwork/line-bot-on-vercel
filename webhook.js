// api/webhook.js (CommonJS for Vercel serverless)
const crypto = require('crypto');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET;
const ACCESS_TOKEN   = process.env.LINE_ACCESS_TOKEN;

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  
    // 讓瀏覽器用 GET 測試也能看到 OK（正式用 POST）
  if (req.method === 'GET') return res.status(200).send('OK (Webhooks are up)');
  
  // collect raw body for signature verification
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const rawBody = Buffer.concat(chunks);

  // verify X-Line-Signature
  const signature = crypto
    .createHmac('sha256', CHANNEL_SECRET)
    .update(rawBody)
    .digest('base64');

  if (req.headers['x-line-signature'] !== signature) {
    return res.status(401).send('Invalid signature');
  }

  const body = JSON.parse(rawBody.toString('utf8'));
  const events = body.events || [];

  // respond 200 quickly (required by LINE)
  res.status(200).send('OK');

  // handle events asynchronously
  for (const event of events) {
    try {
      if (event.type === 'message' && event.message.type === 'text') {
        const userText = event.message.text || '';
        const replyText = `你說了：「${userText}」\n（部署成功 🎉）`;

        await fetch('https://api.line.me/v2/bot/message/reply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ACCESS_TOKEN}`
          },
          body: JSON.stringify({
            replyToken: event.replyToken,
            messages: [{ type: 'text', text: replyText }]
          })
        });
      }
    } catch (e) {
      console.error('Handle event error:', e);
    }
  }
};
