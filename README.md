# LINE Bot on Vercel (Starter)

This is a minimal LINE Messaging API webhook you can deploy to Vercel.

## Files
- `api/webhook.js` – the webhook endpoint (serverless function)
- `package.json` – dependencies (`node-fetch` only)
- `.env.example` – environment variable keys to set in Vercel Project Settings

## Environment Variables (set in Vercel → Project → Settings → Environment Variables)
- `LINE_CHANNEL_SECRET` – from LINE Developers → Messaging API → Channel Secret
- `LINE_ACCESS_TOKEN` – Channel access token (long-lived) from LINE Developers

## Webhook URL
Use this as your Webhook URL in LINE Developers (Messaging API):
```
https://<your-project-name>.vercel.app/api/webhook
```

## Test
Add your bot as a friend in LINE and send any text. It should echo back your message.
