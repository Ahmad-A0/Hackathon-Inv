import React, { useState } from 'react';
import { Download, Globe, Plus } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from './ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import AITutor from './AITutor';
import MarkdownMath from './MarkdownMath';
import {
    generateTranslations,
    defaultTranslations,
    markSolution,
} from '../services/translationService';

const ProblemPage = ({ onBack, speaking, setSpeaking }) => {
    const [language, setLanguage] = useState('English');
    const [translations, setTranslations] = useState(defaultTranslations);
    const [newLanguage, setNewLanguage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [solution, setSolution] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isMarking, setIsMarking] = useState(false);

    const currentText = translations[language] || defaultTranslations.English;

    const handleAddLanguage = async () => {
        if (!newLanguage.trim()) {
            setError('Please enter a language');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const newTranslations = await generateTranslations(newLanguage);
            const langCode = newLanguage.toLowerCase();
            setTranslations((prev) => ({
                ...prev,
                [langCode]: newTranslations,
            }));
            setLanguage(langCode);
            setIsDialogOpen(false);
        } catch (err) {
            setError(
                err.message ||
                    'Failed to generate translations. Please try again.'
            );
        } finally {
            setIsLoading(false);
            setNewLanguage('');
        }
    };

    const handleMarkSolution = async () => {
        if (!solution.trim()) {
            setError('Please enter your solution first');
            return;
        }

        setIsMarking(true);
        setError('');

        try {
            const markingFeedback = await markSolution(solution, language);
            setFeedback(markingFeedback);
        } catch (err) {
            setError(
                err.message ||
                    'Failed to mark solution. Please try again.'
            );
        } finally {
            setIsMarking(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={onBack}
                        className="text-zinc-400 hover:text-white flex items-center font-medium transition-colors"
                    >
                        ← Back to Home
                    </button>

                    <div className="flex items-center gap-2">
                        <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800 transition-colors duration-200">
                                <Globe className="w-4 h-4 mr-2 text-zinc-400" />
                                <SelectValue placeholder="Select Language" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                {Object.entries(translations).map(
                                    ([code, content]) => (
                                        <SelectItem
                                            key={code}
                                            value={code}
                                            className="text-white hover:bg-zinc-800 focus:bg-zinc-800 cursor-pointer transition-colors"
                                        >
                                            {content.title}
                                        </SelectItem>
                                    )
                                )}
                            </SelectContent>
                        </Select>

                        <Dialog
                            open={isDialogOpen}
                            onOpenChange={setIsDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800 transition-colors duration-200"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Language
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                                <DialogHeader>
                                    <DialogTitle className="text-lg font-semibold">
                                        Add New Language
                                    </DialogTitle>
                                    <DialogDescription className="text-zinc-400 mt-1.5">
                                        Enter the language you want to add. The
                                        content will be automatically
                                        translated.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                    <Input
                                        value={newLanguage}
                                        onChange={(e) =>
                                            setNewLanguage(e.target.value)
                                        }
                                        placeholder="Enter language (e.g., Italian)"
                                        className="bg-zinc-800 border-zinc-800 text-white placeholder-zinc-500 focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700"
                                        autoFocus
                                    />
                                    {error && (
                                        <p className="text-red-400 mt-2 text-sm">
                                            {error}
                                        </p>
                                    )}
                                </div>
                                <DialogFooter>
                                    <Button
                                        onClick={handleAddLanguage}
                                        disabled={isLoading}
                                        className="bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700"
                                    >
                                        {isLoading
                                            ? 'Generating...'
                                            : 'Add Language'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <Card className="mb-6 bg-zinc-900 border-zinc-800 rounded-2xl">
                            <CardHeader className="p-6">
                                <CardTitle className="text-2xl font-display">
                                    {currentText.title}
                                </CardTitle>
                                <CardDescription className="text-zinc-400 mt-2 px-2">
                                    {currentText.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-mono text-center my-8 bg-zinc-800 py-8 rounded-xl">
                                    {currentText.equation}
                                </div>
                                <div className="mt-4 p-4 bg-zinc-800 rounded-xl text-zinc-300">
                                    {currentText.explanation}
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <button className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                                        <Download className="h-5 w-5 text-zinc-400 hover:text-white" />
                                    </button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-zinc-900 border-zinc-800 rounded-2xl">
                            <CardHeader className="p-6">
                                <CardTitle className="text-2xl font-display">
                                    Your Solution
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <textarea
                                    className="w-full h-40 p-4 rounded-xl bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500 focus:border-primary focus:ring-1 focus:ring-primary"
                                    placeholder="Write your solution here..."
                                    value={solution}
                                    onChange={(e) => setSolution(e.target.value)}
                                />
                                <div className="mt-4 flex justify-between items-center">
                                    <Button
                                        onClick={handleMarkSolution}
                                        disabled={isMarking || !solution.trim()}
                                        className="bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700"
                                    >
                                        {isMarking ? currentText.marking : currentText.markSolution}
                                    </Button>
                                    {error && (
                                        <p className="text-red-400 text-sm">
                                            {error}
                                        </p>
                                    )}
                                </div>
                                {feedback && (
                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold mb-2">
                                            {currentText.feedback}
                                        </h3>
                                        <div className="p-4 bg-zinc-800 rounded-xl text-zinc-300 prose prose-invert max-w-none">
                                            <MarkdownMath>
                                                {feedback}
                                            </MarkdownMath>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1">
                        <AITutor
                            speaking={speaking}
                            setSpeaking={setSpeaking}
                            language={language}
                            translations={currentText}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemPage;
