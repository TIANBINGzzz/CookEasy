const styles = `
    .deepseek-container {
        width: 95%;
        max-width: 800px;
        margin: 2rem auto;
        padding: 1.25rem;
        border-radius: 0.75rem;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        background-color: #fffaf0;
        font-family: 'Arial', sans-serif;
    }

    .deepseek-title {
        font-size: clamp(1.5rem, 4vw, 2rem);
        margin-bottom: 1.25rem;
        text-align: center;
        color: #a93226;
    }

    .input-hint {
        text-align: center;
        color: #666;
        margin-bottom: 1rem;
        font-size: 0.9rem;
        max-width: 700px;
        margin-left: auto;
        margin-right: auto;
    }

    .example-prompts {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        justify-content: center;
        margin-bottom: 1rem;
        max-width: 700px;
        margin-left: auto;
        margin-right: auto;
        padding: 0 1rem;
    }

    .example-prompt {
        padding: 0.5rem 1rem;
        background-color: #fff3e6;
        border-radius: 1rem;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 1px solid #ffd7b5;
    }

    .example-prompt:hover {
        background-color: #ffe4cc;
        transform: translateY(-2px);
    }

    .deepseek-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 1.25rem;
        max-width: 700px;
        margin-left: auto;
        margin-right: auto;
        width: 100%;
        align-items: center;
    }

    .input-container {
        position: relative;
        width: 100%;
        max-width: 550px;
        margin: 0 auto;
    }

    .deepseek-input {
        width: 100%;
        padding: 0.75rem 3rem 0.75rem 1rem;
        border: 1px solid #e0a899;
        border-radius: 0.5rem;
        font-size: 1rem;
        background-color: #fffaf0;
        color: #5d4037;
        box-sizing: border-box;
    }

    .mic-button {
        position: absolute;
        right: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
        padding: 0.5rem;
        border-radius: 50%;
    }

    .mic-button:hover {
        background-color: rgba(0, 0, 0, 0.05);
    }

    .mic-button.recording {
        color: #ff0000;
        animation: pulse 1s infinite;
        background-color: rgba(255, 0, 0, 0.1);
    }

    .mic-status {
        position: absolute;
        bottom: -1.5rem;
        right: 0;
        font-size: 0.8rem;
        color: #ff0000;
    }

    .deepseek-button {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 0.5rem;
        background-color: rgba(241, 15, 7, 0.89);
        color: white;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        width: 100%;
        max-width: 200px;
        margin: 0 auto;
    }

    .deepseek-button:hover {
        background-color: #d35400;
        transform: translateY(-2px);
    }

    .deepseek-display {
        margin-top: 1.25rem;
    }

    .thinking-output {
        background: #fef9e7;
        padding: 1.25rem;
        border-radius: 0.5rem;
        white-space: pre-wrap;
        word-wrap: break-word;
        min-height: 120px;
        font-size: 1rem;
        line-height: 1.5;
        color: #5d4037;
    }

    .loading-animation {
        font-size: 24px;
        color: rgb(234, 54, 22);
        text-align: center;
        margin-top: 20px;
        animation: pulse 1.5s infinite;
    }

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
        background: #fff9f4;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        transition: transform 0.3s ease, opacity 0.3s ease;
    }

    .card h4 {
        margin-top: 0;
        font-size: 22px;
        color: rgb(211, 33, 71);
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
        background: rgba(255, 243, 224, 0.8);
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

    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
    }

    @media (min-width: 768px) {
        .deepseek-form {
            flex-direction: row;
            align-items: center;
            padding: 0 1rem;
        }

        .input-container {
            flex: 1;
            max-width: 550px;
            margin-right: 1rem;
        }

        .deepseek-button {
            width: auto;
            margin: 0;
            white-space: nowrap;
        }
    }

    @media (max-width: 480px) {
        .deepseek-container {
            margin: 1rem auto;
            padding: 1rem;
        }

        .card {
            width: 85%;
            min-height: auto;
            padding: 1rem;
        }

        .arrow {
            width: 30px;
            height: 30px;
            font-size: 1rem;
        }

        .deepseek-form {
            padding: 0 0.5rem;
        }

        .input-container {
            max-width: 100%;
        }
    }

    .voice-animation-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 2rem 0;
    }

    .voice-animation {
        position: relative;
        width: 120px;
        height: 120px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .voice-wave {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: rgba(255, 0, 0, 0.1);
        animation: wave 2s infinite;
    }

    .voice-icon {
        font-size: 2.5rem;
        z-index: 1;
        animation: pulse 1s infinite;
    }

    .voice-status {
        margin-top: 1rem;
        color: #ff0000;
        font-size: 1rem;
        animation: blink 1.5s infinite;
    }

    @keyframes wave {
        0% {
            transform: scale(0.95);
            opacity: 0.8;
        }
        50% {
            transform: scale(1.1);
            opacity: 0.3;
        }
        100% {
            transform: scale(0.95);
            opacity: 0.8;
        }
    }

    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
        }
    }

    @keyframes blink {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
    }

    /* 当正在识别语音时的样式 */
    .voice-animation.recognizing .voice-wave {
        background: rgba(0, 128, 255, 0.1);
        animation: wave 1.5s infinite;
    }

    .voice-animation.recognizing .voice-status {
        color: #0080ff;
    }

    /* 当正在录音时的样式 */
    .recording-mode {
        padding: 0 !important;
    }
    
    .recording-mode .input-container {
        max-width: 450px;
        transition: max-width 0.3s ease;
        margin: 0 auto;
    }
`;

export default styles; 