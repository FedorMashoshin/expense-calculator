import { openAIClient } from "../config/openAIClient";

export const categorizeTransaction = async (description: string, categories: string[]): Promise<string> => {
    const systemPrompt = 'You are a transaction classifier. Given a single bank-transaction description, pick the single best category from the provided list. Reply with exactly that category name.';
    const userPrompt = `Categories: ${categories.join(', ')}\nDescription: ${description}\nCategory:`;

    const response = await openAIClient.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ],
        temperature: 0
    });

    return response.choices[0].message.content?.trim() || categories[0];
}; 