require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const apiKey = process.env.API_KEY;
const model = process.env.MODEL || 'gemini-2.5-flash';
const geminiApiBase = process.env.GEMINI_API_BASE || 'https://generativelanguage.googleapis.com/v1beta';

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/api/health', (_req, res) => {
    if (!apiKey) {
        return res.status(500).json({ error: 'Server API key is not configured.' });
    }

    return res.status(200).json({ status: 'ok' });
});

app.post('/api/chat', async (req, res) => {
    if (!apiKey) {
        return res.status(500).json({ error: 'Server API key is not configured.' });
    }

    const { contents, generationConfig } = req.body || {};

    if (!Array.isArray(contents) || contents.length === 0) {
        return res.status(400).json({ error: 'Request body must include a non-empty contents array.' });
    }

    const endpoint = `${geminiApiBase}/models/${model}:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents,
                generationConfig
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: data?.error?.message || 'Gemini API request failed.'
            });
        }

        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            return res.status(502).json({ error: 'Gemini returned an empty response.' });
        }

        return res.json({ text });
    } catch (error) {
        return res.status(500).json({
            error: error?.message || 'Unexpected server error while calling Gemini.'
        });
    }
});

app.listen(port, () => {
    console.log(`Chat app server running on http://localhost:${port}`);
});
