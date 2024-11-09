import React, { useState, useRef } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Mic, MicOff } from 'lucide-react';
import {
    startAudioRecording,
    stopAudioRecording,
    processAudioBlob,
    submitAudioToOpenAI
} from '../services/aiTutorService';

const AITutor = ({ speaking, setSpeaking, language, translations }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [response, setResponse] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const recorderRef = useRef(null);
    const streamRef = useRef(null);

    const handleStartRecording = async () => {
        try {
            const { recorder, stream } = await startAudioRecording();
            recorderRef.current = recorder;
            streamRef.current = stream;
            setIsRecording(true);
            setSpeaking?.(true);
            setError(null);
        } catch (error) {
            console.error('Error starting recording:', error);
            setResponse('Error accessing microphone. Please try again.');
        }
    };

    const handleStopRecording = async () => {
        if (!recorderRef.current) return;

        setIsRecording(false);
        setSpeaking?.(false);
        setIsProcessing(true);
        setError(null);

        try {
            const audioBlob = await stopAudioRecording(recorderRef.current, streamRef.current);
            const base64Audio = await processAudioBlob(audioBlob);
            const result = await submitAudioToOpenAI(base64Audio);
            setResponse(result.text);

            if (result.audioData) {
                const audio = new Audio(`data:audio/mpeg;base64,${result.audioData}`);
                await audio.play();
            }
        } catch (error) {
            console.error('Error processing recording:', error);
            setError(error.message);
        } finally {
            setIsProcessing(false);
            recorderRef.current = null;
            streamRef.current = null;
        }
    };

    return (
        <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800 text-white shadow-xl">
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold font-display">
                        AI Tutor
                    </h2>
                </div>

                <div className="min-h-[120px] bg-zinc-800/30 backdrop-blur-sm rounded-xl p-5 font-medium border border-zinc-700/50">
                    {error ? (
                        <div className="text-red-400">{error}</div>
                    ) : isProcessing ? (
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <div className="text-primary">Processing your response...</div>
                        </div>
                    ) : (
                        response || translations.explanation
                    )}
                </div>

                <div className="flex justify-center items-center min-h-[160px] relative">
                    {isRecording && (
                        <>
                            <div className="absolute w-36 h-36 bg-primary/10 rounded-full animate-ping" />
                            <div className="absolute w-28 h-28 bg-primary/20 rounded-full animate-pulse" />
                        </>
                    )}

                    <Button
                        variant="secondary"
                        size="lg"
                        className={`
                            w-28 h-28 rounded-full p-0 relative
                            ${
                                isRecording
                                    ? 'bg-primary text-white hover:bg-primary/90 scale-110 transition-transform duration-200'
                                    : 'bg-zinc-800 text-white hover:bg-zinc-700 hover:scale-105 transition-all duration-200'
                            }
                            shadow-lg hover:shadow-xl border border-zinc-700/50
                            ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                        onMouseDown={handleStartRecording}
                        onMouseUp={handleStopRecording}
                        onTouchStart={handleStartRecording}
                        onTouchEnd={handleStopRecording}
                        disabled={isProcessing}
                    >
                        <div className="flex flex-col items-center justify-center space-y-2">
                            {isRecording ? (
                                <>
                                    <Mic className="h-8 w-8 animate-pulse" />
                                    <span className="text-xs font-medium">
                                        {translations.speaking}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <MicOff className="h-8 w-8" />
                                    <span className="text-xs font-medium">
                                        {isProcessing ? 'Processing...' : translations.holdToSpeak}
                                    </span>
                                </>
                            )}
                        </div>
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default AITutor;
