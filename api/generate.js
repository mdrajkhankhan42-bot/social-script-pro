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
    return res.status(500).json({ error: 'Vercel-এ GEMINI_API_KEY পাওয়া যায়নি।' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error Detail:", data);
      return res.status(response.status).json({
        error: data.error?.message || "Gemini API-তে সমস্যা হয়েছে।"
      });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(500).json({ error: "কোনো টেক্সট জেনারেট হয়নি।" });
    }

    return res.status(200).json({ result: text });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ 
      error: "সার্ভারে অভ্যন্তরীণ সমস্যা হয়েছে। আবার চেষ্টা করুন।" 
    });
  }
}
