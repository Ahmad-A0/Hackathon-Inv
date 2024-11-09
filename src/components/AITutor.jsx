import React, { useState, useRef } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Mic, MicOff } from 'lucide-react';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
    baseURL: 'https://api.openai.com/v1', // Explicitly set the base URL
});

const AITutor = ({ speaking, setSpeaking, language, translations }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [response, setResponse] = useState('');
    const [audioBase64, setAudioBase64] = useState('');
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    const convertToWav = async (audioBlob) => {
        const audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        // Create WAV file
        const numberOfChannels = audioBuffer.numberOfChannels;
        const length = audioBuffer.length * numberOfChannels * 2;
        const buffer = new ArrayBuffer(44 + length);
        const view = new DataView(buffer);

        // Write WAV header
        const writeString = (view, offset, string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };

        writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + length, true);
        writeString(view, 8, 'WAVE');
        writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, numberOfChannels, true);
        view.setUint32(24, audioBuffer.sampleRate, true);
        view.setUint32(28, audioBuffer.sampleRate * numberOfChannels * 2, true);
        view.setUint16(32, numberOfChannels * 2, true);
        view.setUint16(34, 16, true);
        writeString(view, 36, 'data');
        view.setUint32(40, length, true);

        // Write audio data
        const offset = 44;
        const channelData = [];
        for (let i = 0; i < numberOfChannels; i++) {
            channelData.push(audioBuffer.getChannelData(i));
        }

        let index = 0;
        for (let i = 0; i < audioBuffer.length; i++) {
            for (let channel = 0; channel < numberOfChannels; channel++) {
                const sample = channelData[channel][i];
                view.setInt16(
                    offset + index,
                    sample < 0 ? sample * 0x8000 : sample * 0x7fff,
                    true
                );
                index += 2;
            }
        }

        return new Blob([buffer], { type: 'audio/wav' });
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, {
                    type: mediaRecorderRef.current.mimeType,
                });
                try {
                    const wavBlob = await convertToWav(audioBlob);
                    const reader = new FileReader();
                    reader.readAsDataURL(wavBlob);
                    reader.onloadend = async () => {
                        const base64Audio = reader.result.split(',')[1];
                        setAudioBase64(base64Audio);
                        await handleAudioSubmission(base64Audio);
                    };
                } catch (error) {
                    console.error('Error converting audio:', error);
                    setResponse('Error converting audio. Please try again.');
                }
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setSpeaking?.(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    const stopRecording = () => {
        if (
            mediaRecorderRef.current &&
            mediaRecorderRef.current.state === 'recording'
        ) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream
                .getTracks()
                .forEach((track) => track.stop());
            setIsRecording(false);
            setSpeaking?.(false);
        }
    };

    const handleAudioSubmission = async (base64Audio) => {
        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o-audio-preview',
                modalities: ['text', 'audio'],
                audio: { voice: 'alloy', format: 'wav' },
                messages: [
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: 'Please respond to this audio message',
                            },
                            {
                                type: 'input_audio',
                                input_audio: { data: base64Audio, format: 'wav' },
                            },
                        ],
                    },
                ],
            });

            if (response.choices && response.choices[0]) {
                const message = response.choices[0].message;
                // Get transcript from the audio object if content is null
                const responseText = message.content || (message.audio && message.audio.transcript) || 'No response received';
                setResponse(responseText);

                // Handle audio response if present
                if (message.audio && message.audio.data) {
                    // Create audio element with base64 data
                    const audio = new Audio(`data:audio/wav;base64,${message.audio.data}`);
                    audio.play().catch(error => {
                        console.error('Error playing audio:', error);
                    });
                }
            }
        } catch (error) {
            console.error('Error processing audio:', error);
            setResponse('Error processing audio. Please try again.');
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
                    {response || translations.explanation}
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
            `}
                        onMouseDown={startRecording}
                        onMouseUp={stopRecording}
                        onTouchStart={startRecording}
                        onTouchEnd={stopRecording}
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
                                        {translations.holdToSpeak}
                                    </span>
                                </>
                            )}
                        </div>
                    </Button>
                </div>

                {audioBase64 && (
                    <div className="text-sm bg-zinc-800/30 backdrop-blur-sm rounded-xl p-4 font-medium border border-zinc-700/50">
                        Audio recorded successfully
                    </div>
                )}
            </div>
        </Card>
    );
};

export default AITutor;
