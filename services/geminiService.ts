
import { GoogleGenerativeAI, Content, Part } from "@google/generative-ai";

export interface GeneratedVector {
  svg: string;
}

export interface SmartSuggestion {
  action: string;
  description: string;
  type: 'style' | 'geometry' | 'cleanup';
}

export interface CreatedShape {
  type: 'rect' | 'ellipse';
  properties: { [key: string]: any };
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const generateVectorData = async (prompt: string, style: string, currentSvg?: string): Promise<GeneratedVector | null> => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
  
  const systemInstruction: Content = {
    role: "system",
    parts: [{ text: `You are a professional SVG design engine.
      ${currentSvg ? 'Refine and modify the provided SVG based on the user request. Maintain existing IDs where possible.' : 'Create a brand new high-quality SVG illustration.'}
      Style: ${style}.
      Technical: ViewBox "0 0 512 512", optimized paths, semantic grouping.` }]
  };

  const userInstruction: Part[] = currentSvg
    ? [{ text: `Original SVG: ${currentSvg}\n\nModification Request: ${prompt}` }]
    : [{ text: `Create an illustration of: ${prompt}` }];

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: userInstruction }],
      generationConfig: { responseMimeType: "application/json" },
      systemInstruction,
    });
    const response = result.response;
    const json = JSON.parse(response.text());
    return { svg: json.svg };
  } catch (error) {
    console.error("Vector Generation Error:", error);
    return null;
  }
};

export const createShapes = async (prompt: string): Promise<CreatedShape[] | null> => {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
      systemInstruction: {
        role: "system",
        parts: [{
          text: "You are a shape creation expert. Based on the user's prompt, create an array of one or more parametric shape objects. Supported shapes are 'rect' and 'ellipse'. For 'rect', include x, y, width, height, and borderRadius. For 'ellipse', include cx, cy, rx, and ry. Also add fill and stroke properties to each shape."
        }]
      }
    });

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      return JSON.parse(response.text()) as CreatedShape[];
    } catch (error) {
      console.error("Shape Creation Error:", error);
      return null;
    }
};


export const getSmartSuggestions = async (svg: string, selectedId: string): Promise<SmartSuggestion[]> => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const prompt = `Analyze element with ID "${selectedId}" in this SVG: ${svg}. Suggest 3 specific creative improvements.`;

    try {
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        });
        const response = result.response;
        return JSON.parse(response.text()) as SmartSuggestion[];
    } catch (e) {
        console.error("Smart Suggestion Error:", e);
        return [];
    }
};

export const imageToVectorData = async (imageB64: string, prompt: string): Promise<GeneratedVector | null> => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const imagePart = { inlineData: { mimeType: 'image/jpeg', data: imageB64 } };
    const textPart = { text: `Reconstruct this image as a professional SVG. ${prompt}` };

    try {
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [imagePart, textPart] }],
            generationConfig: { responseMimeType: "application/json" }
        });
        const response = result.response;
        const json = JSON.parse(response.text());
        return { svg: json.svg };
    } catch (error) {
        console.error("Image to Vector Error:", error);
        return null;
    }
};
