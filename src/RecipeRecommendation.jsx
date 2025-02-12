import React, { useState, useRef, useEffect } from 'react';

const RecipeRecommendation = () => {
    const [prompt, setPrompt] = useState('');
    const [thinking, setThinking] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    // 用来标记答案是否开始
    const [hasAnswerStarted, setHasAnswerStarted] = useState(false);
    // 用来标记是否已经进入答案部分、以及存储答案部分的文本（JSON）


    const [notFood, setnotFood] = useState(false);
    // 用来标记是否已经进入答案部分、以及存储答案部分的文本（JSON）

    const answerStartedRef = useRef(false);
    const answerBufferRef = useRef('');

    // SSE 数据处理函数
    const processSSEBuffer = (buffer) => {
        let events = [];
        let delimiterIndex;
        while ((delimiterIndex = buffer.indexOf("\n\n")) !== -1) {
            let eventStr = buffer.slice(0, delimiterIndex).trim();
            buffer = buffer.slice(delimiterIndex + 2);
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
        setThinking('');
        setRecipes([]);
        setHasAnswerStarted(false);
        setnotFood(false);
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
                    if (!answerStartedRef.current) {
                        if (eventStr.includes("答案:")) {
                            const parts = eventStr.split("答案:");
                            setThinking(prev => prev + parts[0]);
                            answerStartedRef.current = true;
                            setHasAnswerStarted(true);
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
                console.log(jsonStr);
                const startIndex = jsonStr.indexOf('[');
                const endIndex = jsonStr.lastIndexOf(']');
                if (startIndex !== -1 && endIndex !== -1) {
                    jsonStr = jsonStr.substring(startIndex, endIndex + 1);
                    try {
                        const parsed = JSON.parse(jsonStr);
                        setRecipes(parsed);
                        setHasAnswerStarted(false);
                    } catch (err) {
                        console.log(jsonStr);
                        console.error("JSON解析失败:", err);
                        setnotFood(true);
                    }
                } else {
                    console.error("没有找到有效的JSON数据");
                    setnotFood(true);
                }
            }
        } catch (error) {
            console.error('请求错误：', error);
        }
    };

    useEffect(() => {
        if (recipes.length === 3) {
            setActiveIndex(1);
        } else if (recipes.length > 0) {
            setActiveIndex(0);
        }
    }, [recipes]);

    const handleLeft = () => {
        if (recipes.length > 0) {
            setActiveIndex((activeIndex - 1 + recipes.length) % recipes.length);
        }
    };

    const handleRight = () => {
        if (recipes.length > 0) {
            setActiveIndex((activeIndex + 1) % recipes.length);
        }
    };

    const getCardStyle = (position) => {
        switch (position) {
            case 'active':
                return {
                    transform: 'translateX(0) scale(1) rotateY(0deg)',
                    zIndex: 3,
                    opacity: 1,
                };
            case 'left':
                return {
                    transform: 'translateX(-150px) scale(0.8) rotateY(15deg)',
                    zIndex: 2,
                    opacity: 0.8,
                };
            case 'right':
                return {
                    transform: 'translateX(150px) scale(0.8) rotateY(-15deg)',
                    zIndex: 2,
                    opacity: 0.8,
                };
            default:
                return {};
        }
    };

    let displayContent = null;
    if (notFood) {
        // 错误状态下展示特定动画
        displayContent = (
            <div className="loading-animation">民以食为天，先吃饭再说吧</div>
        );

    } else if (recipes.length > 0) {
        const leftIndex = (activeIndex - 1 + recipes.length) % recipes.length;
        const rightIndex = (activeIndex + 1) % recipes.length;
        displayContent = (
            <>
                <h3>推荐菜谱</h3>
                <div className="carousel">
                    <button className="arrow left" onClick={handleLeft}>◀</button>
                    <div className="cards-container">
                        <div className="card" style={getCardStyle('left')}>
                            <h4>{recipes[leftIndex].dishName}</h4>
                            <p><strong>所需食材:</strong> {recipes[leftIndex].ingredients.join(', ')}</p>
                            <div>
                                <strong>做法:</strong>
                                <div style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>
                                    {recipes[leftIndex].recipe}
                                </div>
                            </div>
                        </div>
                        <div className="card" style={getCardStyle('active')}>
                            <h4>{recipes[activeIndex].dishName}</h4>
                            <p><strong>所需食材:</strong> {recipes[activeIndex].ingredients.join(', ')}</p>
                            <div>
                                <strong>做法:</strong>
                                <div style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>
                                    {recipes[activeIndex].recipe}
                                </div>
                            </div>
                        </div>
                        <div className="card" style={getCardStyle('right')}>
                            <h4>{recipes[rightIndex].dishName}</h4>
                            <p><strong>所需食材:</strong> {recipes[rightIndex].ingredients.join(', ')}</p>
                            <div>
                                <strong>做法:</strong>
                                <div style={{ whiteSpace: 'pre-wrap', marginTop: '8px' }}>
                                    {recipes[rightIndex].recipe}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="arrow right" onClick={handleRight}>▶</button>
                </div>
            </>
        );
    } else if (hasAnswerStarted) {
        displayContent = (
            <div className="loading-animation">食谱正在制作中...</div>
        );
    } else {
        displayContent = (
            <>
                <h3>大厨思路：</h3>
                <pre className="thinking-output">{thinking}</pre>
            </>
        );
    }

    return (
        <div className="deepseek-container">
            <h2 className="deepseek-title">余味厨房</h2>
            <form onSubmit={handleSubmit} className="deepseek-form">
                <input
                    type="text"
                    placeholder="请输入内容..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="deepseek-input"
                />
                <button type="submit" className="deepseek-button">提问</button>
            </form>
            <div className="deepseek-display">
                {displayContent}
            </div>

            <style jsx>{`
                .deepseek-container {
                    max-width: 800px;
                    margin: 50px auto;
                    padding: 20px;
                    border-radius: 12px;
                    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
                    background-color: #fffaf0; /* Floral White */
                    font-family: 'Arial', sans-serif;
                }
                .deepseek-title {
                    font-size: 28px;
                    margin-bottom: 20px;
                    text-align: center;
                    color: #a93226; /* 温暖的深红 */
                }
                .deepseek-form {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 20px;
                }
                .deepseek-input {
                    flex: 1;
                    max-width: 500px;
                    padding: 12px;
                    border: 1px solid #e0a899; /* 温暖的浅棕色 */
                    border-radius: 8px;
                    font-size: 16px;
                    margin-right: 10px;
                    background-color: #fffaf0;
                    color: #5d4037; /* 深棕色 */
                }
                .deepseek-button {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    background-color:rgba(241, 15, 7, 0.89); /* 温暖橙色 */
                    color: #fff;
                    font-size: 16px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                .deepseek-button:hover {
                    background-color: #d35400; /* 深橙色 */
                }
                .deepseek-display {
                    margin-top: 20px;
                }
                .thinking-output {
                    background: #fef9e7; /* 浅黄色 */
                    padding: 20px;
                    border-radius: 8px;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    min-height: 120px;
                    font-size: 16px;
                    line-height: 1.5;
                    color: #5d4037; /* 深棕色 */
                }
                /* Carousel 样式 */
                .carousel {
                    position: relative;
                    margin-top: 20px;
                    perspective: 1000px;
                    height: 400px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .cards-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .card {
                    position: absolute;
                    width: 300px;
                    min-height: 350px;
                    background: #fff9f4; /* 极浅的暖白色 */
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
                    transition: transform 0.3s ease, opacity 0.3s ease;
                }
                .card h4 {
                    margin-top: 0;
                    font-size: 22px;
                    color:rgb(211, 33, 71);
                }
                .card p {
                    font-size: 16px;
                    color: #5d4037;
                }
                .arrow {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 2rem;
                    background: rgba(255, 243, 224, 0.8); /* 浅橙奶油色 */
                    border: none;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    cursor: pointer;
                    outline: none;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                    z-index: 4;
                }
                .arrow.left {
                    left: 10px;
                }
                .arrow.right {
                    right: 10px;
                }
                @media (max-width: 600px) {
                    .card {
                        width: 90%;
                    }
                }
                /* Loading 动画样式 */
                .loading-animation {
                    font-size: 24px;
                    color:rgb(234, 54, 22);
                    text-align: center;
                    margin-top: 20px;
                    animation: pulse 1.5s infinite;
                }
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.05); opacity: 0.7; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default RecipeRecommendation;
