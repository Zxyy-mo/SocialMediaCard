import { GoogleGenAI, Modality } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateImage = async (prompt: string): Promise<string> => {
  const ai = getAiClient();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // Check for candidates and parts
    const candidate = response.candidates?.[0];
    const part = candidate?.content?.parts?.[0];

    if (part && part.inlineData && part.inlineData.data) {
      const base64ImageBytes = part.inlineData.data;
      // Assume PNG based on typical API response, but the mimeType should be checked if available.
      // The guidelines say "mimeType: 'image/png'" is often used in examples.
      const mimeType = part.inlineData.mimeType || 'image/png';
      return `data:${mimeType};base64,${base64ImageBytes}`;
    }

    throw new Error("No image data returned from Gemini");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};