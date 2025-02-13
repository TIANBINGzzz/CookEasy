import React, { useState, useRef } from 'react';

const RecipeRe = () => {
    const [prompt, setPrompt] = useState('');
    const [thinking, setThinking] = useState(''); // 保存“思考:”部分内容
    const [recipes, setRecipes] = useState([]);   // 保存解析后的答案（菜谱数组）

    // 用来标记是否已经进入答案部分、以及存储答案部分的文本（JSON）
    const answerStartedRef = useRef(false);
    const answerBufferRef = useRef('');

    // SSE 数据处理函数，功能与之前一致
    const processSSEBuffer = (buffer) => {
        let events = [];
        let delimiterIndex;
        while ((delimiterIndex = buffer.indexOf("\n\n")) !== -1) {
            let eventStr = buffer.slice(0, delimiterIndex).trim();
            buffer = buffer.slice(delimiterIndex + 2);

            // 去除每行前面的 "data:" 前缀，保留换行
            const cleanedData = eventStr
                .split("\n")
                .map(line => line.startsWith("data:") ? line.substring(5).trim() : line)
                .join("\n");

            if (cleanedData) {
                events.push(cleanedData);
            }
        }
        return { events, buffer };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 重置状态和缓存
        setThinking('');
        setRecipes([]);
        answerStartedRef.current = false;
        answerBufferRef.current = '';
        let sseBuffer = '';

        try {
            const response = await fetch('http://localhost:8080/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
                sseBuffer = buffer;

                events.forEach(eventStr => {
                    // 如果答案部分还未开始
                    if (!answerStartedRef.current) {
                        if (eventStr.includes("答案:")) {
                            // 出现“答案:”时，先将其前面的部分更新到思考区域
                            const parts = eventStr.split("答案:");
                            setThinking(prev => prev + parts[0]);
                            answerStartedRef.current = true;
                            // 将“答案:”后的内容作为答案部分的开始
                            let answerPart = parts.slice(1).join("答案:");
                            // 去除可能存在的 markdown 标记
                            answerPart = answerPart.replace(/```json\s*/g, '').replace(/```\s*/g, '');
                            answerBufferRef.current += answerPart;
                        } else {
                            // 仍在思考阶段，逐步更新显示
                            setThinking(prev => prev + eventStr);
                        }
                    } else {
                        // 已进入答案阶段，累加答案部分的内容
                        let cleaned = eventStr.replace(/```json\s*/g, '').replace(/```\s*/g, '');
                        answerBufferRef.current += cleaned;
                    }
                });
            }

            // SSE 流结束后，尝试从 answerBufferRef.current 中提取有效的 JSON 字符串
            if (answerBufferRef.current) {
                let jsonStr = answerBufferRef.current;
                // 查找第一个 '[' 和最后一个 ']'，提取中间部分
                const startIndex = jsonStr.indexOf('[');
                const endIndex = jsonStr.lastIndexOf(']');
                if (startIndex !== -1 && endIndex !== -1) {
                    jsonStr = jsonStr.substring(startIndex, endIndex + 1);
                    try {
                        const parsed = JSON.parse(jsonStr);
                        setRecipes(parsed);
                    } catch (err) {
                        console.error("JSON解析失败:", err);
                    }
                } else {
                    console.error("没有找到有效的JSON数据");
                }
            }
        } catch (error) {
            console.error('请求错误：', error);
        }
    };

    return (
        <div className="deepseek-container">
            <h2 className="deepseek-title">YS的食谱问答</h2>
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
            <div className="deepseek-display">
                <h3>思考过程</h3>
                <pre className="thinking-output">{thinking}</pre>

                {recipes.length > 0 && (
                    <div className="recipes-output">
                        <h3>推荐菜谱</h3>
                        <div className="cards-container">
                            {recipes.map((recipe, index) => (
                                <div key={index} className="recipe-card">
                                    <h4>{recipe.dishName}</h4>
                                    <p><strong>所需食材:</strong> {recipe.ingredients.join(', ')}</p>
                                    <div>
                                        <strong>做法:</strong>
                                        <div style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>
                                            {recipe.recipe}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

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
        .deepseek-display {
          margin-top: 20px;
        }
        .thinking-output {
          background: #f0f0f0;
          padding: 15px;
          border-radius: 5px;
          white-space: pre-wrap;
          word-wrap: break-word;
          min-height: 100px;
        }
        .recipes-output {
          margin-top: 20px;
        }
        .cards-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }
        .recipe-card {
          background: #e8f5e9;
          padding: 15px;
          border-radius: 5px;
          width: calc(33.33% - 20px);
          box-sizing: border-box;
        }
        @media (max-width: 600px) {
          .recipe-card {
            width: 100%;
          }
        }
      `}</style>
        </div>
    );
};

export default RecipeRe;
