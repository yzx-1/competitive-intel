export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, max_tokens = 1500, provider = 'deepseek', model } = req.body;
  if (!messages) {
    return res.status(400).json({ error: 'messages is required' });
  }

  let url, headers, body;

  if (provider === 'deepseek') {
    url = 'https://api.deepseek.com/chat/completions';
    headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.DEEPSEEK_API_KEY };
    body = { model: model || 'deepseek-v4-pro', messages, max_tokens, temperature: 0.1, stream: true };
  } else if (provider === 'qwen') {
    url = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
    headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.QWEN_API_KEY };
    body = { model: model || 'qwen-plus', messages, max_tokens, temperature: 0.1, stream: true };
  } else if (provider === 'openai') {
    url = 'https://api.openai.com/v1/chat/completions';
    headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY };
    body = { model: model || 'gpt-4o', messages, max_tokens, temperature: 0.1, stream: true };
  } else {
    return res.status(400).json({ error: 'Unsupported provider: ' + provider });
  }

  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      console.error('[llm] upstream error', upstream.status, text.slice(0, 300));
      return res.status(upstream.status).json({ error: text.slice(0, 500) });
    }

    // 透传 SSE 流给前端
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value, { stream: true }));
    }

    res.end();

  } catch (err) {
    console.error('[llm] error', err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: err.message });
    }
  }
}
