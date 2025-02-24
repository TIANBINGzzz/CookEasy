import React from 'react';

const SearchForm = ({
    prompt,
    setPrompt,
    isRecording,
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
            <form onSubmit={handleSubmit} className="deepseek-form">
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="例如：我有胡萝卜和土豆..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="deepseek-input"
                    />
                    <button
                        type="button"
                        className={`mic-button ${isRecording ? 'recording' : ''}`}
                        onClick={isRecording ? onStopRecording : onStartRecording}
                        title={isRecording ? '点击停止录音' : '点击开始语音输入'}
                    >
                        {isRecording ? '⏹' : '🎙️'}
                    </button>
                    {isRecording && (
                        <div className="mic-status">正在录音...</div>
                    )}
                </div>
                <button type="submit" className="deepseek-button">开始推荐</button>
            </form>
        </>
    );
};

export default SearchForm; 