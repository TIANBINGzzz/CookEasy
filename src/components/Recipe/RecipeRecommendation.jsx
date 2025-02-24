import React from 'react';
import { useAudioRecorder } from '../../hooks/useAudioRecorder';
import { useRecipeSearch } from '../../hooks/useRecipeSearch';
import RecipeCarousel from './RecipeCarousel';
import SearchForm from '../common/SearchForm';
import styles from '../../styles/recipeStyles';

const RecipeRecommendation = () => {
    const {
        prompt,
        setPrompt,
        thinking,
        recipes,
        hasAnswerStarted,
        notFood,
        handleSearch,
    } = useRecipeSearch();

    const {
        isRecording,
        isRecognizing,
        startRecording,
        stopRecording
    } = useAudioRecorder({ setPrompt, onRecognitionComplete: handleSearch });

    let displayContent = null;
    if (notFood) {
        displayContent = (
            <div className="loading-animation">民以食为天，先吃饭再说吧</div>
        );
    } else if (recipes.length > 0) {
        displayContent = (
            <>
                <h3>推荐菜谱</h3>
                <RecipeCarousel recipes={recipes} />
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
            <h2 className="deepseek-title">吃什么</h2>
            <SearchForm
                prompt={prompt}
                setPrompt={setPrompt}
                isRecording={isRecording}
                isRecognizing={isRecognizing}
                onStartRecording={startRecording}
                onStopRecording={stopRecording}
                onSubmit={handleSearch}
            />
            <div className="deepseek-display">
                {displayContent}
            </div>
            <style jsx>{styles}</style>
        </div>
    );
};

export default RecipeRecommendation; 