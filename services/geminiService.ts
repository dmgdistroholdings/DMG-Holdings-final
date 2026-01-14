
import { GoogleGenAI, Type } from "@google/genai";

// Always use the API key directly from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are the Chief Strategy Officer (CSO) for DMG DISTRIBUTION HOLDINGS. 
Your objective is to provide high-level, strategic, and institutional-grade insights. 

Brand Values:
- Street-Style Professionalism: Imagine elite music executives in expensive streetwear, not suits.
- Urban Grit & Polish: Industrial textures like concrete, steel, and urban glass, but with high-end lighting.
- High-Contrast Palette: Muted greys, deep charcoals, and blacks.
- Signature Red Accent: Every visual MUST have a sharp, intentional pop of red (e.g., a red light, a red piece of tech, a red fashion detail).
- Active Motion: Avoid static buildings. Show people in motion, studio gear glowing, or active urban meetings.

Persona: Authoritative, visionary, and sharp. Avoid corporate cliches; use "street-corporate" terminology.
Context: DMG Distribution Holdings manages global music distribution and talent architecture.
`;

export const getGeminiResponse = async (userPrompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
        thinkingConfig: { thinkingBudget: 4000 }
      },
    });
    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Intelligence systems are currently offline.";
  }
};

export const generateEnterpriseItem = async (growthPrompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Architect a new business division for DMG Holdings based on this growth prompt: ${growthPrompt}. The tone must be executive and high-fidelity. Respond with a JSON object.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            category: { type: Type.STRING },
            description: { type: Type.STRING },
            features: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["name", "category", "description", "features"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Enterprise Generation Error:", error);
    return null;
  }
};

export const generateSiteImage = async (baseContext: string, customDirective: string): Promise<string | null> => {
  try {
    // Enhanced prompt with more image type variety
    const imageTypeHints = customDirective.toLowerCase();
    let styleModifier = '';
    
    if (imageTypeHints.includes('portrait') || imageTypeHints.includes('artist') || imageTypeHints.includes('person')) {
      styleModifier = 'PORTRAIT MODE: Close-up or medium shot of subject. Dramatic lighting on face/upper body. Professional headshot or editorial portrait style.';
    } else if (imageTypeHints.includes('studio') || imageTypeHints.includes('equipment') || imageTypeHints.includes('gear')) {
      styleModifier = 'STUDIO MODE: Professional recording studio environment. Mixing boards, microphones, instruments, cables. Technical precision with cinematic atmosphere.';
    } else if (imageTypeHints.includes('concert') || imageTypeHints.includes('stage') || imageTypeHints.includes('performance')) {
      styleModifier = 'LIVE PERFORMANCE: Stage, crowd, dynamic motion. Concert lighting, energy, movement. Captured in action.';
    } else if (imageTypeHints.includes('abstract') || imageTypeHints.includes('graphic') || imageTypeHints.includes('pattern')) {
      styleModifier = 'ABSTRACT/GRAPHIC: Geometric patterns, digital art, visual effects. High contrast, bold shapes, modern design aesthetic.';
    } else if (imageTypeHints.includes('product') || imageTypeHints.includes('merch') || imageTypeHints.includes('item')) {
      styleModifier = 'PRODUCT PHOTOGRAPHY: Clean, professional product shots. Minimalist backgrounds, studio lighting, commercial quality.';
    } else if (imageTypeHints.includes('landscape') || imageTypeHints.includes('city') || imageTypeHints.includes('urban')) {
      styleModifier = 'URBAN LANDSCAPE: Wide cityscapes, architectural details, street scenes. Cinematic urban environment.';
    } else {
      styleModifier = 'GENERAL: Active urban business scenes. Music industry elite in motion. High-end streetwear. Brutalist urban alleys, studio lofts.';
    }

    const combinedPrompt = `
      High-end cinematic photography for DMG DISTRIBUTION HOLDINGS.
      Context: ${baseContext}
      Specific Directive: ${customDirective}
      
      ${styleModifier}
      
      Universal Visual Protocol:
      - COLOR PALETTE: Moody greys, deep blacks, charcoal tones. MUST include a SHARP RED ACCENT (red LED, red cable, red fashion detail, red light, red text/graphic element).
      - LIGHTING: Cinematic shadows, dramatic contrast, professional studio or natural urban lighting.
      - QUALITY: Professional grade, 8k resolution, realistic texture, sharp focus.
      - AVOID: Generic stock photos, overly bright/cheerful tones, cluttered compositions.
      - COMPOSITION: Rule of thirds, strong focal point, professional framing.
      - MOOD: Authoritative, elite, street-corporate aesthetic. High-end but gritty.
    `.trim();

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: combinedPrompt }]
      },
      config: {
        imageConfig: { aspectRatio: "16:9" }
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
      // Find the image part, do not assume it is the first part.
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
};
