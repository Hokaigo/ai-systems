import React from 'react';

export default function QuizResults({ score, activeQuiz, startQuiz, setActiveQuiz }) {
    return (
        <div className="bg-[#1c1c20] p-8 rounded-3xl shadow-sm border border-gray-800">
            <button
                onClick={() => setActiveQuiz(null)}
                className="text-sm text-blue-400 mb-6 hover:underline font-semibold inline-flex items-center"
            >
                Back to Generator
            </button>
            <div className="py-8 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-emerald-950/50 text-emerald-400 rounded-full flex items-center justify-center text-4xl font-black mb-6 border border-emerald-800">
                    {score} / {activeQuiz.questions.length}
                </div>
                <h2 className="text-2xl font-extrabold mb-2 text-white">Quiz Completed!</h2>
                <p className="text-gray-400 mb-8">
                    Your score: {score} out of {activeQuiz.questions.length} ({Math.round((score / activeQuiz.questions.length) * 100)}%)
                </p>
                <button
                    onClick={() => startQuiz(activeQuiz)}
                    className="bg-blue-600 text-white px-8 py-3.5 rounded-xl hover:bg-blue-700 font-bold transition shadow-md"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}