export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'প্রম্পট লিখুন।' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: ' GEMINI_API_KEY পাওয়া যায়নি। Vercel এপিআই কী নাম সঠিক আছে কিনা চেক করুন।' });
  }

  try {
    // সরাসরি REST API কল
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // এপিআই-এর আসল এরর দেখার জন্য
      return res.status(500).json({ 
        error: `Google API Error (${response.status}): ${data.error?.message || JSON.stringify(data)}` 
      });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(500).json({ error: "কোনো টেক্সট পাওয়া যায়নি।", rawResponse: data });
    }

    return res.status(200).json({ result: text });
  } catch (error) {
    return res.status(500).json({ error: `Server Error: ${error.message}` });
  }
}
