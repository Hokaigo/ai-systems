import React from 'react';

export default function QuizGenerator({
    text, setText, numQuestions, setNumQuestions, difficulty, setDifficulty,
    loading, error, statusText, progress, generateQuiz
}) {
    return (
        <div className="bg-[#1c1c20] p-8 rounded-3xl shadow-sm border border-gray-800">
            <h1 className="text-2xl md:text-3xl font-extrabold mb-2 text-center text-white">AI English Quiz Generator</h1>
            <p className="text-center text-sm text-gray-400 mb-6">Fast and stable quiz generation with strict answer matching</p>

            {error && (
                <div className="mb-6 p-4 bg-rose-950/30 text-rose-400 rounded-2xl text-sm font-medium border border-rose-900/50">
                    {error}
                </div>
            )}

            <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                disabled={loading}
                className="w-full h-48 p-5 border border-gray-700/80 rounded-2xl mb-6 bg-[#252529] focus:ring-2 focus:ring-blue-500/50 outline-none resize-none transition-all placeholder-gray-400 text-base text-gray-100 custom-scrollbar"
                placeholder="Paste your text or article here..."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">Number of Questions</label>
                    <select
                        value={numQuestions}
                        onChange={e => setNumQuestions(Number(e.target.value))}
                        disabled={loading}
                        className="w-full p-3.5 border border-gray-700/80 rounded-xl bg-[#252529] focus:ring-2 focus:ring-blue-500/50 outline-none font-medium text-gray-100"
                    >
                        <option value={5}>5 Questions</option>
                        <option value={10}>10 Questions</option>
                        <option value={20}>20 Questions</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-400">Difficulty Level</label>
                    <select
                        value={difficulty}
                        onChange={e => setDifficulty(e.target.value)}
                        disabled={loading}
                        className="w-full p-3.5 border border-gray-700/80 rounded-xl bg-[#252529] focus:ring-2 focus:ring-blue-500/50 outline-none font-medium text-gray-100"
                    >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>
            </div>

            {loading && (
                <div className="mb-6">
                    <div className="flex justify-between text-xs font-semibold mb-2 text-blue-400">
                        <span>{statusText}</span>
                        <span>{progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0}%</span>
                    </div>
                    <div className="w-full bg-gray-700 h-2.5 rounded-full overflow-hidden">
                        <div
                            className="bg-blue-600 h-full transition-all duration-300"
                            style={{ width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%` }}
                        />
                    </div>
                </div>
            )}

            <button
                onClick={generateQuiz}
                disabled={loading}
                className="w-full bg-blue-600 text-white font-bold text-base py-4 rounded-2xl hover:bg-blue-700 disabled:bg-blue-500/50 transition-all flex justify-center items-center shadow-lg shadow-blue-600/20"
            >
                {loading ? statusText : 'Generate English Quiz'}
            </button>
        </div>
    );
}