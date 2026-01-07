
import { GoogleGenAI, Type } from "@google/genai";
import { Product, AIInsight } from "../types";

export const getInventoryInsights = async (products: Product[]): Promise<AIInsight[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const inventoryData = products.map(p => ({
    name: p.name,
    stock: p.quantity,
    min: p.minStock,
    category: p.category
  }));

  const prompt = `Analise o seguinte inventário de uma pequena empresa e forneça insights estratégicos de gestão. 
  Considere itens abaixo do estoque mínimo, tendências e sugestões de reposição.
  Dados: ${JSON.stringify(inventoryData)}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              recommendation: { type: Type.STRING },
              priority: { type: Type.STRING, enum: ['low', 'medium', 'high'] }
            },
            required: ["title", "description", "recommendation", "priority"]
          }
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Erro na análise Gemini:", error);
    return [{
      title: "Erro na Análise",
      description: "Não foi possível conectar ao serviço de IA no momento.",
      recommendation: "Tente novamente mais tarde.",
      priority: "medium"
    }];
  }
};

export const generateProductDescription = async (name: string, category: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Gere uma descrição curta e profissional para um produto chamado "${name}" da categoria "${category}" para um sistema de inventário. Seja conciso.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt
    });
    return response.text.trim();
  } catch (error) {
    return "Descrição automática indisponível.";
  }
};
