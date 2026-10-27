import React from 'react';
import { ClockIcon, TrashIcon } from './Icons';

export default function Sidebar({ isSidebarOpen, history, activeQuiz, startQuiz, deleteQuiz }) {
    return (
        <aside className={`flex-shrink-0 bg-[#18181b] border-r border-gray-800/80 transition-all duration-300 ease-in-out overflow-hidden ${isSidebarOpen ? 'w-80' : 'w-0 border-r-0'}`}>
            <div className="w-80 h-full flex flex-col p-5">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold tracking-tight text-white">Quiz History</h2>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-blue-900/30 text-blue-400 rounded-full">
                        {history.length}
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                    {history.length === 0 ? (
                        <div className="text-center py-12 px-4 border border-dashed border-gray-800 rounded-2xl">
                            <p className="text-sm text-gray-500">Your generated quizzes will appear here</p>
                        </div>
                    ) : (
                        history.map(q => (
                            <div
                                key={q.id}
                                onClick={() => startQuiz(q)}
                                className={`group p-4 border rounded-2xl cursor-pointer transition-all duration-200 ${activeQuiz?.id === q.id ? 'border-blue-500 bg-blue-950/30' : 'border-gray-800/80 bg-[#222226] hover:border-gray-700'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-sm text-gray-200 group-hover:text-blue-500 transition-colors line-clamp-1">
                                        {q.questions[0]?.question || `Quiz (${q.count} questions)`}
                                    </h3>
                                    <button
                                        onClick={(e) => deleteQuiz(e, q.id)}
                                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-rose-500 transition"
                                    >
                                        <TrashIcon />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-400 mt-3">
                                    <span className="flex items-center">
                                        <ClockIcon />
                                        <span className="ml-1.5">{q.date}</span>
                                    </span>
                                    <div className="flex gap-1.5">
                                        <span className="px-2 py-0.5 bg-gray-700/60 rounded text-[11px] font-medium">{q.count} Qs</span>
                                        <span className="px-2 py-0.5 bg-gray-700/60 rounded text-[11px] font-medium">{q.difficulty}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </aside>
    );
}