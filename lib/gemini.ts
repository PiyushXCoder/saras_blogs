// Replace with your actual API key
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = "gemini-2.0-flash"; // Or 'gemini-pro-vision' for multimodal
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

export async function generateText(prompt: string): Promise<string | null> {
  try {
    const response: Response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: "You are a blog writer. Write the content of blog only!",
              },
              { text: prompt },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      const errorData = await response.json();
      console.error("Error details:", errorData);
      return null;
    }

    const data = await response.json();
    if (
      data.candidates &&
      data.candidates.length > 0 &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts.length > 0
    ) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.warn("No text generated in the response.");
      return null;
    }
  } catch (error) {
    console.error("Error during API call:", error);
    return null;
  }
}
