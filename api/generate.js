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
    return res.status(500).json({ error: 'GEMINI_API_KEY পাওয়া যায়নি।' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ 
        error: data.error?.message || 'Gemini API থেকে সমস্যা দেখা দিয়েছে।' 
      });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'কোনো আউটপুট পাওয়া যায়নি।';

    return res.status(200).json({ result: text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({
      error: error.message || "Gemini API-তে সমস্যা হয়েছে।"
    });
  }
}
