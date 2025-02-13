import React, { useState } from 'react';

const DeepSeekDisplay = () => {
    const [prompt, setPrompt] = useState('');
    const [text, setText] = useState('');

    // 处理 SSE 数据的函数（去掉 data: 但保留换行）
    const processSSEBuffer = (buffer) => {
        let events = [];
        let delimiterIndex;

        while ((delimiterIndex = buffer.indexOf("\n\n")) !== -1) {
            let eventStr = buffer.slice(0, delimiterIndex).trim();
            buffer = buffer.slice(delimiterIndex + 2); // 更新缓冲区

            // 逐行去掉 `data:`，但保留换行
            const cleanedData = eventStr
                .split("\n") // 按行拆分
                .map(line => line.startsWith("data:") ? line.substring(5).trim() : line) // 只去掉 `data:`
                .join("\n"); // 保持换行结构，不改成空格

            if (cleanedData) {
                events.push(cleanedData);
            }
        }
        return { events, buffer };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setText(''); // 清空显示区域
        let sseBuffer = '';

        try {
            const response = await fetch('http://localhost:8080/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt })
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
                sseBuffer = buffer; // 保留未完成部分

                // 追加数据到文本显示区域，保留换行
                events.forEach(eventStr => {
                    setText(prev => prev + eventStr);
                });
            }
        } catch (error) {
            console.error('请求错误：', error);
        }
    };

    return (
        <div className="deepseek-container">
            <h2 className="deepseek-title">YS的食谱问答：</h2>
            <form onSubmit={handleSubmit} className="deepseek-form">
                <input
                    type="text"
                    placeholder="请输入内容..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="deepseek-input"
                />
                <button type="submit" className="deepseek-button">提交</button>
            </form>
            <pre className="deepseek-output">{text}</pre>

            <style jsx>{`
                .deepseek-container {
                    max-width: 600px;
                    margin: 50px auto;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    background-color: #ffffff;
                    font-family: 'Arial', sans-serif;
                }
                .deepseek-title {
                    font-size: 24px;
                    margin-bottom: 20px;
                    color: #333333;
                }
                .deepseek-form {
                    display: flex;
                    margin-bottom: 20px;
                }
                .deepseek-input {
                    flex: 1;
                    padding: 10px;
                    border: 1px solid #cccccc;
                    border-radius: 5px;
                    font-size: 16px;
                    margin-right: 10px;
                }
                .deepseek-button {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 5px;
                    background-color: #007bff;
                    color: #ffffff;
                    font-size: 16px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                .deepseek-button:hover {
                    background-color: #0056b3;
                }
                .deepseek-output {
                    margin-top: 20px;
                    background: #f0f0f0;
                    padding: 15px;
                    border-radius: 5px;
                    font-size: 16px;
                    white-space: pre-wrap; /* 保留换行 */
                    word-wrap: break-word;
                }
            `}</style>
        </div>
    );
};

export default DeepSeekDisplay;
