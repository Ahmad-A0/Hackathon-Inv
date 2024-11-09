import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
    baseURL: 'https://api.openai.com/v1',
});

const createWavBlob = (audioData, sampleRate) => {
    const buffer = new ArrayBuffer(44 + audioData.length * 2);
    const view = new DataView(buffer);

    // Write WAV header
    const writeString = (view, offset, string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };

    writeString(view, 0, 'RIFF');                     // RIFF identifier
    view.setUint32(4, 36 + audioData.length * 2, true); // file length minus RIFF identifier length and file description length
    writeString(view, 8, 'WAVE');                     // WAVE identifier
    writeString(view, 12, 'fmt ');                    // fmt chunk identifier
    view.setUint32(16, 16, true);                     // fmt chunk length
    view.setUint16(20, 1, true);                      // sample format (raw)
    view.setUint16(22, 1, true);                      // channel count
    view.setUint32(24, sampleRate, true);             // sample rate
    view.setUint32(28, sampleRate * 2, true);         // byte rate (sample rate * block align)
    view.setUint16(32, 2, true);                      // block align (channel count * bytes per sample)
    view.setUint16(34, 16, true);                     // bits per sample
    writeString(view, 36, 'data');                    // data chunk identifier
    view.setUint32(40, audioData.length * 2, true);   // data chunk length

    // Write audio data
    const volume = 1;
    let index = 44;
    for (let i = 0; i < audioData.length; i++) {
        view.setInt16(index, audioData[i] * (0x7FFF * volume), true);
        index += 2;
    }

    return new Blob([buffer], { type: 'audio/wav' });
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
            const responseText = message.content || (message.audio && message.audio.transcript) || 'No response received';
            const audioData = message.audio?.data;

            return {
                text: responseText,
                audioData
            };
        }
        throw new Error('Invalid response format from OpenAI');
    } catch (error) {
        console.error('OpenAI API Error:', error);
        throw new Error('Error processing audio: ' + error.message);
    }
};

export const startAudioRecording = async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
                channelCount: 1,
                sampleRate: 44100
            }
        });

        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        const audioChunks = [];

        processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            audioChunks.push(new Float32Array(inputData));
        };

        source.connect(processor);
        processor.connect(audioContext.destination);

        return {
            audioContext,
            processor,
            source,
            audioChunks,
            stream
        };
    } catch (error) {
        console.error('Error accessing microphone:', error);
        throw new Error('Error accessing microphone: ' + error.message);
    }
};

export const stopAudioRecording = async (recordingData, stream) => {
    if (recordingData && recordingData.audioContext) {
        const { audioContext, processor, source, audioChunks } = recordingData;
        
        // Disconnect and clean up audio nodes
        source.disconnect();
        processor.disconnect();
        
        // Concatenate all audio chunks
        const length = audioChunks.reduce((acc, chunk) => acc + chunk.length, 0);
        const audioData = new Float32Array(length);
        let offset = 0;
        
        for (const chunk of audioChunks) {
            audioData.set(chunk, offset);
            offset += chunk.length;
        }

        // Create WAV blob
        const wavBlob = createWavBlob(audioData, audioContext.sampleRate);
        
        // Close audio context and stop tracks
        await audioContext.close();
        stream.getTracks().forEach(track => track.stop());

        return wavBlob;
    }
};
