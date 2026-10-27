import React from 'react';

export default function QuizPlayer({
    activeQuiz, currentQIdx, score, selectedAnswer, handleAnswerClick, handleNextQuestion, setActiveQuiz
}) {
    const currentQ = activeQuiz.questions[currentQIdx];

    const getOptionStyle = (opt) => {
        const isCorrect = opt.trim().toLowerCase() === currentQ.correct_answer.trim().toLowerCase();
        if (!selectedAnswer) return "hover:bg-gray-800 border-gray-700 bg-[#252525] cursor-pointer text-gray-200";
        if (isCorrect) return "bg-emerald-500 text-white border-emerald-600 shadow-md";
        if (selectedAnswer === opt) return "bg-rose-500 text-white border-rose-600 shadow-md";
        return "opacity-40 cursor-not-allowed border-gray-700 bg-[#1a1a1a]";
    };

    return (
        <div className="bg-[#1c1c20] p-8 rounded-3xl shadow-sm border border-gray-800">
            <button
                onClick={() => setActiveQuiz(null)}
                className="text-sm text-blue-400 mb-6 hover:underline font-semibold inline-flex items-center"
            >
                Back to Generator
            </button>

            <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Question {currentQIdx + 1} of {activeQuiz.questions.length}
                </span>
                <span className="text-xs font-bold text-blue-400 bg-blue-950/40 px-3 py-1.5 rounded-lg">
                    Score: {score}
                </span>
            </div>

            <h3 className="text-xl md:text-2xl font-bold mb-8 leading-snug whitespace-normal break-words text-white">
                {currentQ.question}
            </h3>

            <div className="space-y-3 mb-6">
                {currentQ.options.map((opt, i) => (
                    <button
                        key={i}
                        onClick={() => handleAnswerClick(opt)}
                        className={`w-full text-left p-4 border-2 rounded-xl transition-all duration-150 text-base font-medium whitespace-normal break-words ${getOptionStyle(opt)}`}
                    >
                        {opt}
                    </button>
                ))}
            </div>

            {selectedAnswer && (
                <div className="flex justify-end pt-2">
                    <button
                        onClick={handleNextQuestion}
                        className="bg-blue-600 text-white px-7 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-md"
                    >
                        {currentQIdx + 1 === activeQuiz.questions.length ? 'Finish Quiz' : 'Next Question'}
                    </button>
                </div>
            )}
        </div>
    );
}