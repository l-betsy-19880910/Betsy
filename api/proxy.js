// api/proxy.js
export default async function handler(req, res) {
    // 1. 只允许 POST 请求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { question } = req.body;
    if (!question) {
        return res.status(400).json({ error: 'Missing question' });
    }

    // 2. 你的 API Key（从环境变量读取，安全）
    const API_KEY = process.env.sk-5364d3acffaa4145be9aaa6b74e7c662;
    const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'; // 智谱为例

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'glm-4-flash',
                messages: [{ role: 'user', content: question }],
                max_tokens: 500
            })
        });
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || '抱歉，我没能理解。';
        res.status(200).json({ reply });
    } catch (error) {
        res.status(500).json({ error: 'AI服务出错' });
    }
}