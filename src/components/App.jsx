import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import StartScreen from './StartScreen';
import Quiz from './Quiz';
import AnimalGame from './AnimalGame';
import MemoryGame from './MemoryGame';
import Report from './Report';
import '../styles/App.css';

function App() {
  const [gameStage, setGameStage] = useState('start');
  const [isAdmin, setIsAdmin] = useState(false); // Track if admin is logged in
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [currentSessionData, setCurrentSessionData] = useState({
    quizScores: [],
    animalGameScore: 0,
    memoryGameScore: 0,
    expressionTally: { quiz: 0, animalGame: 0, memoryGame: 0 }
  });
  const [allSessions, setAllSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);

  // Handle admin login
  const handleAdminLogin = () => {
    setIsAdmin(true); // Set admin mode
  };

  const handleStartQuiz = () => {
    const newSessionId = `session_${Date.now()}`;
    setCurrentSessionId(newSessionId);
    setCurrentSessionData({
      quizScores: [],
      animalGameScore: 0,
      memoryGameScore: 0,
      expressionTally: { quiz: 0, animalGame: 0, memoryGame: 0 }
    });
    setGameStage('quiz');
    alert(`Starting new session with ID: ${newSessionId}`);
  };

  const handleQuizEnd = (score, expressionTally) => {
    setCurrentSessionData(prev => ({
      ...prev,
      quizScores: [...prev.quizScores, score],
      expressionTally: { ...prev.expressionTally, quiz: expressionTally }
    }));
    setGameStage('animalGame');
  };

  const handleAnimalGameEnd = (score, expressionTally) => {
    setCurrentSessionData(prev => ({
      ...prev,
      animalGameScore: score,
      expressionTally: { ...prev.expressionTally, animalGame: expressionTally }
    }));
    setGameStage('memoryGame');
  };

  const handleMemoryGameEnd = (score, expressionTally) => {
    const completedSessionData = {
      sessionId: currentSessionId,
      ...currentSessionData,
      memoryGameScore: score,
      expressionTally: { ...currentSessionData.expressionTally, memoryGame: expressionTally }
    };

    setAllSessions(prev => [...prev, completedSessionData]);
    setGameStage('start'); // Go back to home screen after memory game ends
  };

  const handleViewSessionReport = (session) => {
    setSelectedSession(session);
  };

  const handleBackToStart = () => {
    setGameStage('start');
    setSelectedSession(null);
    setIsAdmin(false); // Reset admin view when going back
  };

  return (
    <div className="app">
      {isAdmin ? (
        // Show Report component for admin view
        <Report
          allSessions={allSessions}
          selectedSession={selectedSession}
          onViewSessionReport={handleViewSessionReport}
          onBackToHome={handleBackToStart}
        />
      ) : (
        // Regular game flow
        <>
          {gameStage === 'start' && (
            <StartScreen onStartQuiz={handleStartQuiz} onAdminLogin={handleAdminLogin} />
          )}
          {gameStage === 'quiz' && <Quiz onQuizEnd={handleQuizEnd} />}
          {gameStage === 'animalGame' && <AnimalGame onFinish={handleAnimalGameEnd} />}
          {gameStage === 'memoryGame' && <MemoryGame onFinish={handleMemoryGameEnd} />}
        </>
      )}
    </div>
  );
}

export default App;
