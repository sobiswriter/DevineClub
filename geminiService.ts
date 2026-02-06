
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function askNexusAI(query: string, context: string = "") {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: query,
    config: {
      systemInstruction: `You are 'Nexus AI', the central intelligence of Project Nexus campus super-app.
      
      CURRENT USER CONTEXT:
      ${context}
      
      RULES:
      1. Use the provided context to answer personal questions about the user's schedule, profile, or items.
      2. If asked about their day, summarize their upcoming classes and pending assignments.
      3. Be helpful, concise, and professional.
      4. If user info is missing from context, mention you're ready to help once they add data to their Cockpit.`
    }
  });
  return response.text;
}

export async function analyzeMarketplaceItem(title: string, description: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this marketplace item: "${title}". Description: "${description}".`,
    config: {
      systemInstruction: `You are a marketplace expert. Provide:
      - recommendedPrice: a suggested price range string (in Rupees).
      - conditionScore: 1-10 based on description.
      - searchTags: array of 3-5 relevant keywords.
      - buyerTips: 1 short sentence for potential buyers.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recommendedPrice: { type: Type.STRING },
          conditionScore: { type: Type.NUMBER },
          searchTags: { type: Type.ARRAY, items: { type: Type.STRING } },
          buyerTips: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text);
}

export async function generateFlashcards(topic: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Create 5 high-yield study flashcards for the topic: "${topic}".`,
    config: {
      systemInstruction: "You are an educational assistant. Create flashcards with a 'front' (question) and 'back' (answer). Keep them concise and academic.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            front: { type: Type.STRING },
            back: { type: Type.STRING }
          },
          required: ["front", "back"]
        }
      }
    }
  });
  return JSON.parse(response.text);
}

export async function predictTopicDifficulty(subject: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Predict the complexity and common pitfalls for: "${subject}".`,
    config: {
      systemInstruction: "You are an academic advisor. Analyze a subject/topic and provide a difficulty rating (1-10), a 'complexityScore' (1-10), and 3 'criticalPitfalls' to watch out for.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          difficulty: { type: Type.NUMBER },
          complexityScore: { type: Type.NUMBER },
          criticalPitfalls: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });
  return JSON.parse(response.text);
}

export async function summarizeEmail(content: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: content,
    config: {
      systemInstruction: `You are a campus assistant for "Project Nexus". 
      Analyze the campus email and return a JSON object. 
      Fields:
      - summary: 1 concise action-oriented sentence.
      - category: exactly one of [academic, urgent, events, general].
      - priority: exactly one of [low, medium, high].
      - priorityScore: integer 1-10.
      - sentiment: string (e.g., "Urgent", "Positive", "Frustrated", "Neutral").
      - deadline: Extract specific date/time or "none".
      - actionRequired: boolean.
      - relevanceReason: 1 short phrase why this matters to a student.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          category: { type: Type.STRING },
          priority: { type: Type.STRING },
          priorityScore: { type: Type.NUMBER },
          sentiment: { type: Type.STRING },
          deadline: { type: Type.STRING },
          actionRequired: { type: Type.BOOLEAN },
          relevanceReason: { type: Type.STRING }
        },
        required: ["summary", "category", "priority", "priorityScore", "sentiment", "deadline", "actionRequired", "relevanceReason"]
      }
    }
  });
  return JSON.parse(response.text);
}

export async function generateStudyPlan(subject: string, timeframe: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a study schedule for ${subject} over the next ${timeframe}.`,
    config: {
      systemInstruction: "You are an expert academic advisor. Provide a structured study plan with daily milestones.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          milestones: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                topic: { type: Type.STRING },
                duration: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  });
  return JSON.parse(response.text);
}
