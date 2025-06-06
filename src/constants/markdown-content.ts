export const UPLOAD_INSTRUCTION_MARKDOWN = `
## How to Upload your Cards

Ask your AI agent to create a JSON with cards on a given language and topic 
as an array of objects with the following structure:

  - \`id\`: A unique identifier for the word pair (string)
  - \`sourceLanguage\`: The source language name (string)
  - \`targetLanguage\`: The target language name (string)
  - \`sourceWord\`: The word/short phrase in the source language
  - \`targetWord\`: The word/short in the target language
  - \`pronunciation\`: IPA pronunciation transcription
  - \`remark\`: (Optional) Additional context or meaning clarification, if needed to clarify the meaning of the word/phrase
  

### Prompt Example
> Please, create JSON with an array of the  following structure:
>  - \`id\`: A unique identifier for the word pair (string)
>  - \`sourceLanguage\`: Polish
>  - \`targetLanguage\`: English
>  - \`sourceWord\`: The word/short phrase in the source language
>  - \`targetWord\`: The word/short in the target language
>  - \`pronunciation\`: IPA pronunciation transcription
>  - \`remark\`: (Optional) Additional context or meaning clarification, if needed to clarify the meaning of the word/phrase
>
>   Parameters:
> - Source language: Polish
> - Target language: English
> - Topic: Common phrases
> - Limit: 30 cards

### JSON Output Example
\`\`\`json
[
  {
    "id": "1",
    "sourceLanguage": "Polish",
    "targetLanguage": "English",
    "sourceWord": "Dzień dobry",
    "targetWord": "Good morning / Good day",
    "pronunciation": "/d͡ʑɛɲ ˈdɔbrɨ/",
    "remark": "Formal greeting used until afternoon"
  },
  {
    "id": "2",
    "sourceLanguage": "Polish",
    "targetLanguage": "English",
    "sourceWord": "Do widzenia",
    "targetWord": "Goodbye",
    "pronunciation": "/dɔ viˈd͡zɛɲa/",
    "remark": "Formal farewell, literally 'until seeing'"
  },
  {
    "id": "3",
    "sourceLanguage": "Polish",
    "targetLanguage": "English",
    "sourceWord": "Cześć",
    "targetWord": "Hi / Hello / Bye (informal)",
    "pronunciation": "/t͡ʂɛɕt͡ɕ/",
    "remark": "Informal greeting, also used for goodbye"
  },
  ...
]
\`\`\`
`;