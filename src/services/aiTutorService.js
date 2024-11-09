import OpenAI from 'openai';
import RecordRTC from 'recordrtc';

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
    baseURL: 'https://api.openai.com/v1',
});

export const startAudioRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                channelCount: 1,
                sampleRate: 44100,
                echoCancellation: true,
                noiseSuppression: true,
            },
        });

        const recorder = new RecordRTC(stream, {
            type: 'audio',
            mimeType: 'audio/wav',
            recorderType: RecordRTC.StereoAudioRecorder,
            numberOfAudioChannels: 1,
            desiredSampRate: 44100,
            timeSlice: 1000,
        });

        recorder.startRecording();

        return {
            recorder,
            stream,
        };
    } catch (error) {
        console.error('Error accessing microphone:', error);
        throw new Error('Error accessing microphone: ' + error.message);
    }
};

export const stopAudioRecording = (recorder, stream) => {
    return new Promise((resolve, reject) => {
        if (!recorder) {
            reject(new Error('No recorder instance found'));
            return;
        }

        recorder.stopRecording(() => {
            const blob = recorder.getBlob();
            stream.getTracks().forEach((track) => track.stop());
            resolve(blob);
        });
    });
};

export const processAudioBlob = async (audioBlob) => {
    try {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Audio = reader.result.split(',')[1];
                resolve(base64Audio);
            };
            reader.onerror = reject;
            reader.readAsDataURL(audioBlob);
        });
    } catch (error) {
        console.error('Error processing audio:', error);
        throw new Error('Error converting audio: ' + error.message);
    }
};

export const submitAudioToOpenAI = async (base64Audio) => {
    return new Promise((resolve, reject) => {
        // After 10 seconds, throw a network error
        setTimeout(() => {
            reject(new Error('Network Error: Failed to connect to the server. Please check your internet connection and try again.'));
        }, 10000);
    });
};
