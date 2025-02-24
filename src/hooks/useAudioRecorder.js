import { useState, useRef } from 'react';
import { API_ENDPOINTS } from '../config/constants';

export const useAudioRecorder = ({ setPrompt, onRecognitionComplete }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isRecognizing, setIsRecognizing] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (e) => {
                audioChunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                setIsRecognizing(true);
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                await sendAudioToServer(audioBlob);
                audioChunksRef.current = [];
                setIsRecognizing(false);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error('麦克风访问失败:', err);
            alert('无法访问麦克风，请检查权限设置');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const sendAudioToServer = async (audioBlob) => {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.wav');

        try {
            const response = await fetch(API_ENDPOINTS.SPEECH_RECOGNITION, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (data.text) {
                const currentPrompt = data.text.trim();
                setPrompt(currentPrompt);
                onRecognitionComplete(currentPrompt);
            }
        } catch (error) {
            console.error('语音识别失败:', error);
            alert('语音识别服务暂时不可用');
        }
    };

    return {
        isRecording,
        isRecognizing,
        startRecording,
        stopRecording
    };
}; 