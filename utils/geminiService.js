const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generateEmail = async ({ name, age, location, language }) => {
  const prompt = `
Create a formal marketing email for a person named ${name}, aged ${age}, living in ${location}. 
The email must be in their local spoken language (${language}), but written using the Latin alphabet (e.g., Hinglish, Tanglish, etc).

Tone: Highly formal and professional. Avoid jokes, slang, casual expressions, emojis, or flashy tone.

Structure:
- Subject line: concise and professional
- HTML email body (with inline CSS using Arial or Helvetica font)
  - Bold header showing subject line
  - Respectful greeting (e.g., "Adarniya", "Namaskar", etc.)
  - 2–3 formal, informative paragraphs
  - Courteous sign-off

Return strictly as JSON:
{
  "subject": "...",
  "body": "..."
}
`;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result.response.candidates[0].content.parts[0].text;
    const cleanedText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Gemini generation error:", error.message);
    return {
      subject: "Aapke Liye Ek Vishesh Suchna",
      body: `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              h1 { font-size: 22px; font-weight: bold; color: #1A1A1A; }
              p { font-size: 16px; }
              footer { font-size: 14px; color: #777; }
            </style>
          </head>
          <body>
            <h1>Aapke Liye Ek Vishesh Suchna</h1>
            <p>Adarniya ${name},</p>
            <p>Hum aapko yah suchit karna chahte hain ki hamari nai sevaayein aapke shetra ${location} mein uplabdh ho gayi hain. Yeh sevaayein aapke vyavsayik aur vyaktigat avashyaktaon ke anuroop viksit ki gayi hain.</p>
            <p>Aapki suvidha hetu, hamne ek vishesh prastav tayar kiya hai jo sirf chune gaye graahakon ke liye hai.</p>
            <footer>Vinamrta sahit,<br>Seva Prabandhak</footer>
          </body>
        </html>
      `,
    };
  }
};

const generateMultipleEmails = async ({ name, age, location, language, count = 5,title }) => {
  console.log(title);
  
  const prompt = `
Create ${count} formal marketing emails for a person named ${name}, aged ${age}, from ${location}. 
Each email must be in their local language (${language}) written using the Latin alphabet (e.g., Hinglish, Tanglish, etc.) and mail content must be specific related to ${title}

Tone: Strictly formal and respectful. Avoid humor, slang, flashy language, emojis, or casual phrases.

Each email must include:
- A short, professional subject line
- HTML email body with:
  - Bold header (subject line)
  - Respectful greeting
  - 2–3 informative and clear paragraphs
  - Formal footer/sign-off

Use inline CSS and Arial/Helvetica fonts.

Return only JSON:
{
  "emails": [
    { "subject": "...", "body": "..." },
    ...
  ]
}
`;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result.response.candidates[0].content.parts[0].text;
    const cleanedText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanedText).emails;
  } catch (error) {
    console.error("Gemini generation error:", error.message);
    return Array(count).fill({
      subject: "Aapke Liye Ek Vishesh Suchna",
      body: `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              h1 { font-size: 22px; font-weight: bold; color: #1A1A1A; }
              p { font-size: 16px; }
              footer { font-size: 14px; color: #777; }
            </style>
          </head>
          <body>
            <h1>Aapke Liye Ek Vishesh Suchna</h1>
            <p>Adarniya ${name},</p>
            <p>Kripya yah suchna grahan karein ki hamari nai sevaayein aapke kshetra mein uplabdh hain. Hamara lakshya hamesha aapki santushti hai.</p>
            <p>Kripya is suvidha ka laabh uthane ke liye sampark karein.</p>
            <footer>Vinamrta sahit,<br>Seva Prabandhak</footer>
          </body>
        </html>
      `,
    });
  }
};

module.exports = { generateEmail, generateMultipleEmails };
