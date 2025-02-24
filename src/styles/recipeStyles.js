const styles = `
    .deepseek-container {
        max-width: 800px;
        margin: 50px auto;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        background-color: #fffaf0;
        font-family: 'Arial', sans-serif;
    }

    .deepseek-title {
        font-size: 28px;
        margin-bottom: 20px;
        text-align: center;
        color: #a93226;
    }

    .deepseek-form {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
    }

    .input-container {
        position: relative;
        flex: 1;
        max-width: 500px;
        margin-right: 10px;
    }

    .deepseek-input {
        width: 90%;
        padding: 12px 45px 12px 15px;
        border: 1px solid #e0a899;
        border-radius: 8px;
        font-size: 16px;
        background-color: #fffaf0;
        color: #5d4037;
    }

    .mic-button {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        font-size: 1.2em;
        cursor: pointer;
        transition: transform 0.2s;
    }

    .mic-button:hover {
        transform: translateY(-50%) scale(1.1);
    }

    .mic-button.recording {
        color: #ff0000;
        animation: pulse 1s infinite;
    }

    .deepseek-button {
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        background-color: rgba(241, 15, 7, 0.89);
        color: white;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .deepseek-button:hover {
        background-color: #d35400;
    }

    .deepseek-display {
        margin-top: 20px;
    }

    .thinking-output {
        background: #fef9e7;
        padding: 20px;
        border-radius: 8px;
        white-space: pre-wrap;
        word-wrap: break-word;
        min-height: 120px;
        font-size: 16px;
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

    @media (max-width: 600px) {
        .card {
            width: 90%;
        }
    }
`;

export default styles; 