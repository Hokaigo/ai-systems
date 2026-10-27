export const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

export const parseJsonFromText = (textResponse) => {
    try {
        let cleaned = textResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
        const firstBrace = cleaned.indexOf('{');
        const lastBrace = cleaned.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            cleaned = cleaned.substring(firstBrace, lastBrace + 1);
        }
        return JSON.parse(cleaned);
    } catch {
        return null;
    }
};

export const hasPlaceholderOptions = (options) => {
    return options.some(opt => {
        const lower = opt.toLowerCase();
        return lower.includes('option') || lower.includes('placeholder') || lower.includes('correct or false') || lower.length < 2;
    });
};