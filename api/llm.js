export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, system, max_tokens = 1500, provider = 'deepseek', model } = req.body;
  if (!messages) {
    return res.status(400).json({ error: 'messages is required' });
  }

  try {
    let url, headers, body;

    if (provider === 'deepseek') {
      const selectedModel = model || 'deepseek-v4-pro';
      url = 'https://api.deepseek.com/chat/completions';
      headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.DEEPSEEK_API_KEY
      };
      body = {
        model: selectedModel,
        messages,
        max_tokens,
        temperature: 0.1
      };

    } else if (provider === 'qwen') {
      const selectedModel = model || 'qwen-plus';
      url = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
      headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.QWEN_API_KEY
      };
      body = {
        model: selectedModel,
        messages,
        max_tokens,
        temperature: 0.1
      };

    } else if (provider === 'openai') {
      const selectedModel = model || 'gpt-4o';
      url = 'https://api.openai.com/v1/chat/completions';
      headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY
      };
      body = {
        model: selectedModel,
        messages,
        max_tokens,
        temperature: 0.1
      };

    } else {
      return res.status(400).json({ error: 'Unsupported provider: ' + provider });
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
