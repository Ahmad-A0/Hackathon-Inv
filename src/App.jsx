import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    AlertCircle,
    CheckCircle,
    PlayCircle,
    TimerReset,
    Info,
    X,
    Trophy,
    Medal,
    Share2,
    BookOpen,
    Settings,
    Volume2,
    VolumeX,
    HelpCircle,
    ArrowLeftCircle,
    Star,
    Moon,
    Sun,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from 'src/components/ui/alert';
import { Progress } from 'src/components/ui/progress';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from 'src/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from 'src/components/ui/dialog';

// Game difficulty settings
const DIFFICULTY_SETTINGS = {
    easy: { time: 240, penaltyTime: 10, scoreMultiplier: 1 },
    medium: { time: 180, penaltyTime: 20, scoreMultiplier: 1.5 },
    hard: { time: 120, penaltyTime: 30, scoreMultiplier: 2 },
    flawless: { time: 100, penaltyTime: 100, scoreMultiplier: 3 },
};

// Sample articles database - in real app, this would be much larger
const ARTICLES = [
    {
        id: 1,
        title: "Tech Giants Reshape Silicon Valley's Real Estate Market",
        text: `(Apple Inc) has announced plans to convert its ($16 billion) campus into shared workspace. The [Google-owned] property will feature [underwater meeting rooms] and (automated robot security) by next quarter. The company's [CEO Tim Cook] cited [decreasing office demand] as the primary motivation.`,
        difficulty: 'easy',
        category: 'technology',
        link: 'https://www.ft.com/content/tech-giants-reshape-valley',
    },
    {
        id: 2,
        title: 'Revolutionary Breakthrough in Sustainable Aviation',
        text: `British Airways has successfully tested (algae-based jet fuel) in a (commercial flight from London to New York). The [solar-powered] aircraft achieved [supersonic speeds] while reducing emissions by [95%]. The (£2.3 billion) project marks a significant milestone in green aviation.`,
        difficulty: 'medium',
        category: 'science',
        link: 'https://www.ft.com/content/sustainable-aviation-breakthrough',
    },
    {
        id: 3,
        title: 'Global Financial Markets Face Historic Shift',
        text: `The [European Central Bank] has announced a partnership with [Amazon] to launch a (digital Euro) by [2024]. The unprecedented move saw (Switzerland's stock market) suspend trading for (72 hours) while [crypto markets] experienced [1000%] growth. [Christine Lagarde] called it "the future of banking."`,
        difficulty: 'hard',
        category: 'finance',
        link: 'https://www.ft.com/content/global-markets-shift',
    },
    {
        id: 4,
        title: 'Art Market Disruption: Traditional Galleries Face Digital Revolution',
        text: `The (Louvre Museum) has generated (€300 million) through its first [blockchain-based] art auction. The [AI-created] masterpieces sold for [triple] the price of traditional artwork. Leading galleries are now [replacing physical locations] with (virtual reality exhibitions) that attracted (2.3 million visitors) last month.`,
        difficulty: 'medium',
        category: 'arts',
        link: 'https://www.ft.com/content/art-market-disruption',
    },
];

const parseArticleText = (text) => {
    const parts = [];
    let currentIndex = 0;
    const regex = /\[.*?\]|\(.*?\)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > currentIndex) {
            parts.push({
                type: 'normal',
                content: text.slice(currentIndex, match.index),
            });
        }
        parts.push({
            type: match[0].startsWith('[') ? 'incorrect' : 'maybe',
            content: match[0].slice(1, -1),
            start: match.index,
            end: regex.lastIndex,
            id: `selection-${parts.length}`,
        });
        currentIndex = regex.lastIndex;
    }

    if (currentIndex < text.length) {
        parts.push({ type: 'normal', content: text.slice(currentIndex) });
    }

    return parts;
};

export default function SkewdleGame() {
    // Game state
    const [gameStatus, setGameStatus] = useState('idle'); // idle, active, paused, ended
    const [difficulty, setDifficulty] = useState('medium');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(DIFFICULTY_SETTINGS.medium.time);
    const [highScores, setHighScores] = useState(() => {
        const saved = localStorage.getItem('skewdle-highscores');
        return saved ? JSON.parse(saved) : { easy: 0, medium: 0, hard: 0, flawless: 0 };
    });
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);
    const [totalGamesPlayed, setTotalGamesPlayed] = useState(0);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [showTutorial, setShowTutorial] = useState(true);

    // Article state
    const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
    const [articleParts, setArticleParts] = useState([]);
    const [selectedParts, setSelectedParts] = useState({});
    const [incorrectSelection, setIncorrectSelection] = useState(false);

    // Achievement system
    const [achievements, setAchievements] = useState(() => {
        const saved = localStorage.getItem('skewdle-achievements');
        return saved
            ? JSON.parse(saved)
            : {
                  firstGame: false,
                  perfectGame: false,
                  speedRunner: false,
                  marathoner: false,
                  sharpEye: false,
              };
    });

    // Sound effects
    const sounds = useMemo(
        () => ({
            correct: new Audio('/correct.mp3'),
            incorrect: new Audio('/incorrect.mp3'),
            gameOver: new Audio('/gameover.mp3'),
            achievement: new Audio('/achievement.mp3'),
        }),
        []
    );

    // Initialize game
    useEffect(() => {
        setArticleParts(parseArticleText(ARTICLES[currentArticleIndex].text));
    }, [currentArticleIndex]);

    // Game timer
    useEffect(() => {
        let timer;
        if (gameStatus === 'active' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            endGame();
        }
        return () => clearInterval(timer);
    }, [gameStatus, timeLeft]);

    // Save high scores
    useEffect(() => {
        localStorage.setItem('skewdle-highscores', JSON.stringify(highScores));
    }, [highScores]);

    // Save achievements
    useEffect(() => {
        localStorage.setItem(
            'skewdle-achievements',
            JSON.stringify(achievements)
        );
    }, [achievements]);

    const startGame = () => {
        const settings = DIFFICULTY_SETTINGS[difficulty];
        setGameStatus('active');
        setScore(0);
        setTimeLeft(settings.time);
        setSelectedParts({});
        setCurrentArticleIndex(0);
        setCurrentStreak(0);
        setTotalGamesPlayed((prev) => prev + 1);
        setCurrentLevel(1); // Reset current level when starting a new game

        // First game achievement
        if (!achievements.firstGame) {
            unlockAchievement('firstGame');
        }
    };

    const endGame = () => {
        setGameStatus('ended');
        if (soundEnabled) sounds.gameOver.play();

        // Update high scores
        const finalScore =
            score * DIFFICULTY_SETTINGS[difficulty].scoreMultiplier;
        if (finalScore > highScores[difficulty]) {
            setHighScores((prev) => ({
                ...prev,
                [difficulty]: finalScore,
            }));
        }

        // Check achievements
        if (score > 100) unlockAchievement('marathoner');
        if (currentStreak > 10) unlockAchievement('sharpEye');
        if (timeLeft > DIFFICULTY_SETTINGS[difficulty].time / 2)
            unlockAchievement('speedRunner');
    };

    const unlockAchievement = (achievementId) => {
        if (!achievements[achievementId]) {
            setAchievements((prev) => ({
                ...prev,
                [achievementId]: true,
            }));
            if (soundEnabled) sounds.achievement.play();
        }
    };

    const handleTextSelection = useCallback(
        (part) => {
            if (gameStatus !== 'active' || selectedParts[part.id]) return;

            const isCorrect = part.type === 'incorrect';
            const settings = DIFFICULTY_SETTINGS[difficulty];

            if (isCorrect) {
                setScore((prevScore) => prevScore + 1);
                setCurrentStreak((prev) => prev + 1);
                setBestStreak((prev) => Math.max(prev, currentStreak + 1));
                if (soundEnabled) sounds.correct.play();

                // Check if all incorrect parts are found in current article
                const allIncorrectFound = articleParts
                    .filter((p) => p.type === 'incorrect')
                    .every((p) => selectedParts[p.id] || p.id === part.id); // Check if the current part is the last incorrect one

                if (allIncorrectFound) {
                    if (currentArticleIndex === ARTICLES.length - 1) {
                        // All levels completed, end the game
                        endGame();
                    } else {
                        // Move to the next level
                        setCurrentArticleIndex((prev) => prev + 1);
                        setCurrentLevel((prev) => prev + 1);
                        setSelectedParts({}); // Reset selectedParts when moving to the next level
                    }
                }
            } else {
                setScore((prevScore) => Math.max(0, prevScore - 1));
                setCurrentStreak(0);
                setIncorrectSelection(true);
                setTimeout(() => setIncorrectSelection(false), 1000);
                setTimeLeft((prevTime) =>
                    Math.max(0, prevTime - settings.penaltyTime)
                );
                if (soundEnabled) sounds.incorrect.play();
            }

            setSelectedParts((prev) => ({
                ...prev,
                [part.id]: isCorrect,
            }));
        },
        [
            gameStatus,
            selectedParts,
            difficulty,
            currentStreak,
            soundEnabled,
            articleParts,
            currentArticleIndex,
        ]
    );

    return (
        <div
            className={`min-h-screen bg-[#1a1b26] text-gray-200 p-6 font-sans ${
                incorrectSelection ? 'animate-shake' : ''
            }`}
            aria-label="Skewdle Game"
            data-testid="app-container"
        >
            <div className="max-w-4xl mx-auto mt-2">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1
                        className="text-6xl font-bold text-[#7aa2f7] font-serif transition duration-500 hover:transform hover:rotate-6"
                        aria-label="Skewdle Game Title"
                    >
                        Skewdle
                    </h1>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                            aria-label="Toggle Sound"
                        >
                            {soundEnabled ? (
                                <Volume2 size={24} />
                            ) : (
                                <VolumeX size={24} />
                            )}
                        </button>
                        <Dialog>
                            <DialogTrigger aria-label="Open Help Dialog">
                                <HelpCircle size={24} />
                            </DialogTrigger>
                            <DialogContent className="bg-[#1f2335] text-gray-200 border-gray-700">
                                <DialogHeader>
                                    <DialogTitle>How to Play</DialogTitle>
                                </DialogHeader>
                                <TutorialDialog
                                    showTutorial={showTutorial}
                                    setShowTutorial={setShowTutorial}
                                />
                            </DialogContent>
                        </Dialog>
                        <button
                            onClick={() =>
                                console.log('Dark mode button clicked')
                            }
                            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                            aria-label="Toggle Dark Mode"
                        >
                            <Moon size={24} />
                        </button>
                    </div>
                </div>

                {/* Main Game Container */}
                <Game
                    gameStatus={gameStatus}
                    currentLevel={currentLevel}
                    score={score}
                    timeLeft={timeLeft}
                    difficulty={difficulty}
                    setDifficulty={setDifficulty}
                    startGame={startGame}
                    handleTextSelection={handleTextSelection}
                    selectedParts={selectedParts}
                    aria-label="Game Area"
                />

                {/* Stats, Achievements & Leaderboard */}
                <div
                    className="grid grid-cols-2 gap-6 mb-6"
                    aria-label="Game Stats and Achievements"
                >
                    <Stats
                        bestStreak={bestStreak}
                        totalGamesPlayed={totalGamesPlayed}
                        highScores={highScores}
                        currentStreak={currentStreak}
                    />
                    <Achievements achievements={achievements} />
                </div>
                <div className="mb-6" aria-label="Leaderboard">
                    <Leaderboard highScores={highScores} />
                </div>

                {/* Game Over Dialog */}
                <GameOverDialog
                    gameStatus={gameStatus}
                    score={score}
                    difficulty={difficulty}
                    currentStreak={currentStreak}
                    currentLevel={currentLevel}
                    achievements={achievements}
                    startGame={startGame}
                    articles={ARTICLES}
                    aria-label="Game Over Dialog"
                />

                {/* Tutorial Dialog */}
                <TutorialDialog
                    showTutorial={showTutorial && gameStatus === 'idle'}
                    setShowTutorial={setShowTutorial}
                    aria-label="Tutorial Dialog"
                />
            </div>
        </div>
    );
}
