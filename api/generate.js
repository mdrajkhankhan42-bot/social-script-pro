import { GoogleGenerativeAI } from '@google/generative-ai';

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
    const genAI = new GoogleGenerativeAI(apiKey);
    // গুগল জেমিনাই-এর আপডেট করা মডেল নাম
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ result: text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({
      error: error.message || "Gemini API-তে সমস্যা হয়েছে।"
    });
  }
}
