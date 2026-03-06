// === LLM CLIENT — IMPORTANT ===
// This file wraps calls to your LLM provider (e.g., OpenAI, Groq, Mistral).
//
// SETUP INSTRUCTIONS:
// 1. Add your API key to .env.local:
//    VITE_LLM_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
//    VITE_LLM_ENDPOINT=https://api.openai.com/v1/chat/completions
//
// 2. For Vercel production, go to:
//    Dashboard → Your Project → Settings → Environment Variables
//    Add VITE_LLM_API_KEY and VITE_LLM_ENDPOINT there.
//
// 3. NEVER commit .env.local to git. It is already in .gitignore.
//
// 4. To switch providers (e.g., Groq, Mistral), change VITE_LLM_ENDPOINT
//    and the 'model' field below.

const LLM_ENDPOINT =
    import.meta.env.VITE_LLM_ENDPOINT ||
    'https://api.openai.com/v1/chat/completions'

const LLM_KEY = import.meta.env.VITE_LLM_API_KEY
const LLM_MODEL = import.meta.env.VITE_LLM_MODEL || 'gpt-4o-mini'

export async function callLLM(messages, systemPrompt = '') {
    // Return a mock response in dev mode if key is missing
    if (!LLM_KEY || LLM_KEY === 'mock') {
        console.warn('[LLM] No VITE_LLM_API_KEY set. Using mock response.')
        return {
            choices: [
                {
                    message: {
                        role: 'assistant',
                        content:
                            '🤖 [Mock Response] Set VITE_LLM_API_KEY in .env.local to connect a real AI model.',
                    },
                },
            ],
        }
    }

    const allMessages = systemPrompt
        ? [{ role: 'system', content: systemPrompt }, ...messages]
        : messages

    const res = await fetch(LLM_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${LLM_KEY}`, // <-- API key sent here (HTTPS only)
        },
        body: JSON.stringify({
            model: LLM_MODEL,
            messages: allMessages,
        }),
    })

    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error?.message || `LLM request failed: ${res.status}`)
    }

    return res.json()
}

// Helper: extract text from LLM response
export function extractLLMText(response) {
    return response?.choices?.[0]?.message?.content || ''
}
