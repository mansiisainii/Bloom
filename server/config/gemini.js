const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

async function detectFood(base64Image, mimeType) {
  const prompt = `You are a nutrition expert. Look at this food image and identify the dish.
Respond ONLY with valid JSON, no markdown formatting, no extra text, in this exact format:
{
  "food_name": "name of the dish",
  "calories": estimated_number,
  "protein": estimated_grams,
  "carbs": estimated_grams,
  "fat": estimated_grams
}
If you cannot identify food in the image, respond with:
{ "error": "No food detected" }`;

  const result = await model.generateContent([
    prompt,
    { inlineData: { data: base64Image, mimeType } },
  ]);

  const text = result.response.text().trim();
  const cleaned = text.replace(/```json|```/g, '').trim();

  return JSON.parse(cleaned);
}

module.exports = { detectFood };