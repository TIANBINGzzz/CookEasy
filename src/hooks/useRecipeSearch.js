import { useState, useRef } from 'react';
import { processSSEBuffer } from '../utils/sseUtils';
import { API_ENDPOINTS } from '../config/constants';

export const useRecipeSearch = () => {
    const [prompt, setPrompt] = useState('');
    const [thinking, setThinking] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [hasAnswerStarted, setHasAnswerStarted] = useState(false);
    const [notFood, setNotFood] = useState(false);

    const answerStartedRef = useRef(false);
    const answerBufferRef = useRef('');

    const handleSearch = async (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }

        const currentPrompt = await new Promise(resolve => {
            setPrompt(prev => {
                resolve(prev);
                return prev;
            });
        });

        setThinking(() => '');
        setRecipes(() => []);
        setHasAnswerStarted(() => false);
        setNotFood(() => false);
        answerStartedRef.current = false;
        answerBufferRef.current = '';
        let sseBuffer = '';

        try {
            const response = await fetch(API_ENDPOINTS.RECIPE_GENERATION, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: currentPrompt })
            });

            if (!response.body) {
                console.error('响应中没有 body');
                return;
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let done = false;

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                sseBuffer += decoder.decode(value, { stream: !done });
                const { events, buffer } = processSSEBuffer(sseBuffer);
                sseBuffer = buffer;
                events.forEach(eventStr => {
                    if (!answerStartedRef.current) {
                        if (eventStr.includes("答案:")) {
                            const parts = eventStr.split("答案:");
                            setThinking(prev => prev + parts[0]);
                            answerStartedRef.current = true;
                            setHasAnswerStarted(() => true);
                            let answerPart = parts.slice(1).join("答案:");
                            answerPart = answerPart.replace(/```json\s*/g, '').replace(/```\s*/g, '');
                            answerBufferRef.current += answerPart;
                        } else {
                            setThinking(prev => prev + eventStr);
                        }
                    } else {
                        let cleaned = eventStr.replace(/```json\s*/g, '').replace(/```\s*/g, '');
                        answerBufferRef.current += cleaned;
                    }
                });
            }

            if (answerBufferRef.current) {
                let jsonStr = answerBufferRef.current;
                const startIndex = jsonStr.indexOf('[');
                const endIndex = jsonStr.lastIndexOf(']');
                if (startIndex !== -1 && endIndex !== -1) {
                    jsonStr = jsonStr.substring(startIndex, endIndex + 1);
                    try {
                        const parsed = JSON.parse(jsonStr);
                        setRecipes(() => parsed);
                        setHasAnswerStarted(() => false);
                    } catch (err) {
                        console.error("JSON解析失败:", err);
                        setNotFood(() => true);
                    }
                } else {
                    console.error("没有找到有效的JSON数据");
                    setNotFood(() => true);
                }
            }
        } catch (error) {
            console.error('请求错误：', error);
        }
    };

    return {
        prompt,
        setPrompt,
        thinking,
        setThinking,
        recipes,
        setRecipes,
        hasAnswerStarted,
        setHasAnswerStarted,
        notFood,
        setNotFood,
        handleSearch,
        answerStartedRef,
        answerBufferRef
    };
}; 