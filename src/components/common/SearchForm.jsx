import React from 'react';

const SearchForm = ({
    prompt,
    setPrompt,
    isRecording,
    onStartRecording,
    onStopRecording,
    onSubmit
}) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit} className="deepseek-form">
            <div className="input-container">
                <input
                    type="text"
                    placeholder="请输入内容..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="deepseek-input"
                />
                <button
                    type="button"
                    className={`mic-button ${isRecording ? 'recording' : ''}`}
                    onClick={isRecording ? onStopRecording : onStartRecording}
                >
                    {isRecording ? '⏹' : '🎤'}
                </button>
            </div>
            <button type="submit" className="deepseek-button">提问</button>
        </form>
    );
};

export default SearchForm; 