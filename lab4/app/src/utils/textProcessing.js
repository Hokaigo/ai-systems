export const splitTextIntoChunks = (rawText, numChunks) => {
    const cleanedRaw = rawText.replace(/^\s*\d+\s*$/gm, ' ').replace(/\s+/g, ' ').trim();
    const sentences = cleanedRaw.match(/[^.!?]+[.!?]+|\s*[^.!?]+$/g) || [cleanedRaw];

    if (sentences.length <= numChunks) {
        const res = [];
        for (let i = 0; i < numChunks; i++) {
            res.push(sentences[i % sentences.length].trim());
        }
        return res;
    }

    const chunks = [];
    const step = sentences.length / numChunks;
    for (let i = 0; i < numChunks; i++) {
        const start = Math.floor(i * step);
        const end = Math.floor((i + 1) * step);
        const slice = sentences.slice(start, Math.max(start + 1, end)).join(' ').trim();
        if (slice) chunks.push(slice);
    }
    return chunks;
};