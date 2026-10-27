import { parseJsonFromText } from '../utils/validation';

export const fetchEnglishQuizData = async (chunkText, diff) => {
    let difficultyRule = "";
    if (diff === "easy") {
        difficultyRule = "EASY: Ask about a very obvious fact (like a specific name, date, or main entity). Make the 3 wrong options completely unrelated or obviously incorrect so the right answer stands out.";
    } else if (diff === "medium") {
        difficultyRule = "MEDIUM: Ask about the purpose, concept, or how things relate. Make the 3 wrong options plausible, using words from the text context to make the user think.";
    } else if (diff === "hard") {
        difficultyRule = "HARD: Ask about a minor detail, specific consequence, or a logical inference. Make the 3 wrong options highly deceptive and very similar to the correct answer to trick the user.";
    } else {
        difficultyRule = "Create a standard factual question with plausible distractors.";
    }

    const prompt = `You are a strict quiz generator. Read the provided EXCLUSIVE text excerpt below and create 1 factual multiple-choice question based ONLY on this specific text.
RULES:
1. Formulate a clear question derived directly from the text excerpt.
2. Provide exactly 4 options: 1 correct answer (which MUST be identical or directly match your "correct_answer" field), and 3 realistic false distractors.
3. NEVER use generic templates, ellipsis (...), or placeholder words like "Option 1".
4. DIFFICULTY INSTRUCTION: ${difficultyRule}

Return STRICTLY in valid JSON format:
{
  "question": "Your generated question here?",
  "options": ["Exact correct option text", "Wrong option 1", "Wrong option 2", "Wrong option 3"],
  "correct_answer": "Exact correct option text"
}`;

    const res = await fetch('http://localhost:11434/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'qwen2.5:1.5b-q4_0',
            messages: [
                { role: 'system', content: prompt },
                { role: 'user', content: `EXCLUSIVE Text excerpt to analyze: "${chunkText}"` }
            ],
            temperature: 0.1,
            max_tokens: 300
        })
    });

    if (!res.ok) throw new Error('Ollama server connection error');
    const data = await res.json();
    return parseJsonFromText(data.choices[0].message.content);
};