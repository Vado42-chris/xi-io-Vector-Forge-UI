
import { GoogleGenAI, Type } from "@google/genai";

export interface GeneratedVector {
  svg: string;
  layers: {
    id: string;
    name: string;
    color: string;
  }[];
}

export interface SmartSuggestion {
  action: string;
  description: string;
  type: 'style' | 'geometry' | 'cleanup';
}

/**
 * Generates or refines an SVG based on a text prompt.
 */
export const generateVectorData = async (prompt: string, style: string, currentSvg?: string): Promise<GeneratedVector | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const systemPrompt = `You are a professional SVG design engine. 
    ${currentSvg ? 'Refine and modify the provided SVG based on the user request. Maintain existing IDs where possible.' : 'Create a brand new high-quality SVG illustration.'}
    Style: ${style}.
    Technical: ViewBox "0 0 512 512", optimized paths, semantic grouping.`;

    const contents = currentSvg 
      ? `Original SVG: ${currentSvg}\n\nModification Request: ${prompt}`
      : `Create an illustration of: ${prompt}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            svg: { type: Type.STRING },
            layers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  color: { type: Type.STRING },
                },
                required: ["id", "name", "color"],
              },
            },
          },
          required: ["svg", "layers"],
        },
      },
    });

    // Access .text property directly (not as a method) as per @google/genai guidelines.
    if (!response.text) {
      throw new Error('No response text from Gemini API');
    }
    return JSON.parse(response.text) as GeneratedVector;
  } catch (error) {
    console.error("Vector Generation Error:", error);
    return null;
  }
};

/**
 * Analyzes a specific selection and suggests AI-driven improvements.
 */
export const getSmartSuggestions = async (svg: string, selectedId: string): Promise<SmartSuggestion[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze element with ID "${selectedId}" in this SVG: ${svg}. Suggest 3 specific creative improvements.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              action: { type: Type.STRING, description: "Short imperative command" },
              description: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['style', 'geometry', 'cleanup'] }
            },
            required: ["action", "description", "type"]
          }
        }
      }
    });
    // Access .text property directly as per @google/genai guidelines.
    if (!response.text) {
      return [];
    }
    return JSON.parse(response.text);
  } catch (e) {
    return [];
  }
};

/**
 * Converts an image base64 into vector data using Gemini vision capabilities.
 */
export const imageToVectorData = async (imageB64: string, prompt: string): Promise<GeneratedVector | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const imagePart = { inlineData: { mimeType: 'image/jpeg', data: imageB64 } };
    const textPart = { text: `Reconstruct this image as a professional SVG. ${prompt}` };
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      // Corrected: Multi-part contents should ideally be passed as an object with a 'parts' array.
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            svg: { type: Type.STRING },
            layers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  color: { type: Type.STRING },
                },
                required: ["id", "name", "color"],
              },
            },
          },
          required: ["svg", "layers"],
        },
      },
    });
    // Access .text property directly as per @google/genai guidelines.
    if (!response.text) {
      return null;
    }
    return JSON.parse(response.text);
  } catch (error) {
    return null;
  }
};
