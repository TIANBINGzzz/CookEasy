import React from 'react';

const SearchForm = ({
    prompt,
    setPrompt,
    isRecording,
    isRecognizing,
    onStartRecording,
    onStopRecording,
    onSubmit
}) => {
    const examplePrompts = [
        "我有西红柿和鸡蛋",
        "想吃川菜",
        "清淡易消化的",
        "我有两块牛肉和辣椒"
    ];

    const handleExampleClick = (example) => {
        setPrompt(example);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <>
            <p className="input-hint">
                输入食材或想吃的菜系，让大厨为您推荐美味菜谱
            </p>
            <div className="example-prompts">
                {examplePrompts.map((example, index) => (
                    <span
                        key={index}
                        className="example-prompt"
                        onClick={() => handleExampleClick(example)}
                    >
                        {example}
                    </span>
                ))}
            </div>
            <form onSubmit={handleSubmit} className={`deepseek-form ${(isRecording || isRecognizing) ? 'recording-mode' : ''}`}>
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="例如：我有胡萝卜和土豆..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="deepseek-input"
                    />
                    {!isRecording && !isRecognizing && (
                        <button
                            type="button"
                            className="mic-button"
                            onClick={onStartRecording}
                            title="点击开始语音输入"
                        >
                            🎙️
                        </button>
                    )}
                </div>
                {!isRecording && !isRecognizing && (
                    <button type="submit" className="deepseek-button">开始推荐</button>
                )}
            </form>
            {(isRecording || isRecognizing) && (
                <div className="voice-animation-container" onClick={isRecording ? onStopRecording : null}>
                    <div className={`voice-animation ${isRecognizing ? 'recognizing' : ''}`}>
                        <div className="voice-wave"></div>
                        <div className="voice-icon">{isRecognizing ? '🔍' : '🎙️'}</div>
                    </div>
                    <p className="voice-status">
                        {isRecognizing ? '正在识别语音...' : '点击停止录音'}
                    </p>
                </div>
            )}
        </>
    );
};

export default SearchForm; 