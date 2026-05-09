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
    body = { model: model || 'deepseek-v4-pro', messages, max_tokens, temperature: 0.1 };
  } else if (provider === 'qwen') {
    url = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
    headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.QWEN_API_KEY };
    body = { model: model || 'qwen-plus', messages, max_tokens, temperature: 0.1 };
  } else if (provider === 'openai') {
    url = 'https://api.openai.com/v1/chat/completions';
    headers = { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY };
    body = { model: model || 'gpt-4o', messages, max_tokens, temperature: 0.1 };
  } else {
    return res.status(400).json({ error: 'Unsupported provider: ' + provider });
  }

  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
      // 注意：不设置 signal/timeout，让 Vercel maxDuration 控制
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      console.error('[llm] upstream error', upstream.status, text.slice(0, 300));
      return res.status(upstream.status).json({ error: text.slice(0, 500) });
    }

    const data = await upstream.json();
    return res.status(200).json(data);

  } catch (err) {
    console.error('[llm] error', err.message);
    return res.status(500).json({ error: err.message });
  }
}
