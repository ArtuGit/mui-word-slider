class AiPromptService {
    static getCardsRequestForDeckPrompt({
                                            topic,
                                            description,
                                            sourceLanguage,
                                            targetLanguage,
                                            amount,
                                        }: {
        id: string;
        topic: string;
        description: string;
        sourceLanguage: string;
        targetLanguage: string;
        amount: number;
    }): string {
        return `Please, create JSON with an array of the following structure and values:

id: A unique identifier for the word pair (uuid)
sourceLanguage: ${sourceLanguage}
targetLanguage: ${targetLanguage}
sourceWord: The word/short phrase in the source language
targetWord: The word/short phrase in the target language
pronunciation: IPA pronunciation transcription
remark: (Optional) Additional context or meaning clarification, if needed to clarify the meaning of the word/phrase

Parameters:

Source language: ${sourceLanguage}
Target language: ${targetLanguage}
Topic: ${topic}
Description (additional context for the topic): ${description}
Limit: ${amount} items
`;
    }
}

export default AiPromptService;
