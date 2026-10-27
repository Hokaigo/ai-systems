import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import QuizGenerator from './components/QuizGenerator';
import QuizPlayer from './components/QuizPlayer';
import QuizResults from './components/QuizResults';
import { fetchEnglishQuizData } from './api/ollama';
import { splitTextIntoChunks } from './utils/textProcessing';
import { shuffleArray, hasPlaceholderOptions } from './utils/validation';

export default function App() {
  const [text, setText] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('Medium');
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState('');

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('engQuizHistory');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load history:', e);
    }
    return [];
  });

  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    try {
      localStorage.setItem('engQuizHistory', JSON.stringify(history));
    } catch (e) { }
  }, [history]);

  const generateQuiz = async () => {
    if (!text.trim() || text.trim().length < 20) {
      return setError('Please enter a longer text for quiz generation.');
    }

    setLoading(true);
    setError('');

    try {
      const chunks = splitTextIntoChunks(text, numQuestions);
      setProgress({ current: 0, total: numQuestions });
      const questions = [];
      const seenQuestionsSet = new Set();

      for (let i = 0; i < numQuestions; i++) {
        const currentChunk = chunks[i % chunks.length];
        setProgress({ current: i + 1, total: numQuestions });
        setStatusText(`Generating question ${i + 1} of ${numQuestions}...`);

        let validQuestion = null;
        let attempts = 0;

        while (attempts < 5 && !validQuestion) {
          attempts++;
          try {
            const data = await fetchEnglishQuizData(currentChunk, difficulty);

            if (data && data.question && data.options && data.correct_answer) {
              const trimmedOptions = data.options.map(o => o.trim());
              const uniqueOptionsSet = new Set(trimmedOptions.map(o => o.toLowerCase()));
              const qClean = data.question.trim().toLowerCase();

              const isMetaQuestion = qClean.includes('snippet') || qClean.includes('instruction');
              const hasEllipsis = trimmedOptions.some(o => o.includes('...'));
              const hasCorrectAnswer = trimmedOptions.some(
                o => o.toLowerCase() === data.correct_answer.trim().toLowerCase()
              );

              if (
                !isMetaQuestion &&
                !hasEllipsis &&
                hasCorrectAnswer &&
                !seenQuestionsSet.has(qClean) &&
                uniqueOptionsSet.size === 4 &&
                trimmedOptions.length === 4 &&
                !hasPlaceholderOptions(trimmedOptions)
              ) {
                seenQuestionsSet.add(qClean);
                validQuestion = {
                  question: data.question.trim(),
                  options: shuffleArray(trimmedOptions),
                  correct_answer: data.correct_answer.trim()
                };
              }
            }
          } catch { }
        }

        if (!validQuestion) {
          validQuestion = {
            question: `What is the key statement regarding this text part?`,
            options: shuffleArray([
              currentChunk,
              "No action required",
              "Invalid request format",
              "General notice"
            ]),
            correct_answer: currentChunk
          };
        }

        questions.push(validQuestion);
      }

      if (questions.length === 0) {
        throw new Error('Model failed to generate valid questions.');
      }

      setStatusText('Finalizing and saving quiz...');
      const newQuiz = {
        id: Date.now(),
        date: new Date().toLocaleString('en-US'),
        count: questions.length,
        difficulty,
        questions
      };

      setHistory(prevHistory => [newQuiz, ...prevHistory]);
      startQuiz(newQuiz);
      setText('');
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
      setStatusText('');
      setProgress({ current: 0, total: 0 });
    }
  };

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQIdx(0);
    setScore(0);
    setQuizFinished(false);
    setSelectedAnswer(null);
    setError('');
  };

  const deleteQuiz = (e, id) => {
    e.stopPropagation();
    setHistory(prevHistory => prevHistory.filter(q => q.id !== id));
    if (activeQuiz?.id === id) setActiveQuiz(null);
  };

  const handleAnswerClick = (opt) => {
    if (selectedAnswer) return;

    setSelectedAnswer(opt);
    const isCorrect = opt.trim().toLowerCase() === activeQuiz.questions[currentQIdx].correct_answer.trim().toLowerCase();

    if (isCorrect) setScore(s => s + 1);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    if (currentQIdx + 1 < activeQuiz.questions.length) {
      setCurrentQIdx(c => c + 1);
    } else {
      setQuizFinished(true);
    }
  };

  return (
    <div className="dark h-screen flex font-sans bg-[#121212] text-gray-100 overflow-hidden">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        history={history}
        activeQuiz={activeQuiz}
        startQuiz={startQuiz}
        deleteQuiz={deleteQuiz}
      />
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <Header
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <main className="flex-1 px-6 py-8 flex items-start justify-center">
          <div className="w-full max-w-3xl">
            {!activeQuiz ? (
              <QuizGenerator
                text={text}
                setText={setText}
                numQuestions={numQuestions}
                setNumQuestions={setNumQuestions}
                difficulty={difficulty}
                setDifficulty={setDifficulty}
                loading={loading}
                error={error}
                statusText={statusText}
                progress={progress}
                generateQuiz={generateQuiz}
              />
            ) : quizFinished ? (
              <QuizResults
                score={score}
                activeQuiz={activeQuiz}
                startQuiz={startQuiz}
                setActiveQuiz={setActiveQuiz}
              />
            ) : (
              <QuizPlayer
                activeQuiz={activeQuiz}
                currentQIdx={currentQIdx}
                score={score}
                selectedAnswer={selectedAnswer}
                handleAnswerClick={handleAnswerClick}
                handleNextQuestion={handleNextQuestion}
                setActiveQuiz={setActiveQuiz}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}