package com.steam.test;

import org.springframework.web.reactive.function.client.WebClient;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

public class DeepSeekClientTest {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public DeepSeekClientTest() {
        this.webClient = WebClient.builder().baseUrl("http://localhost:11434").build();
        this.objectMapper = new ObjectMapper();
    }

    public void processWithDeepSeek(String text) {
        // 建议使用 Jackson 构造 JSON（见前面建议），这里为简便起见依旧使用字符串拼接
        String payload = String.format("{\"model\": \"deepseek-r1:14b\", \"prompt\": \"%s\", \"stream\": true}", text);

        webClient.post()
                .uri("/api/generate")
                .header("Content-Type", "application/json")
                .bodyValue(payload)
                .retrieve()
                .bodyToFlux(String.class)  // 以流式方式处理数据
                .map(this::parseDeepSeekResponse)  // 解析每一行 JSON
                .doOnNext(this::printSlowly)         // 缓慢输出流数据
                .blockLast();                        // 阻塞直到流式请求完成
    }

    /**
     * 解析 DeepSeek 返回的 JSON 行
     */
    private String parseDeepSeekResponse(String json) {
        try {
            JsonNode jsonNode = objectMapper.readTree(json);
            String fullText = jsonNode.path("response").asText();

            // 解析 <think> 标签
            String thinkContent = null;
            String finalAnswer = fullText;

            if(fullText.contains("<think>")){
                return String.format("思考:\n");
            }
            else if(fullText.contains("</think>")){
                return String.format("答案:\n");
            }

//            if (fullText.contains("<think>") && fullText.contains("</think>")) {
//                thinkContent = fullText.substring(fullText.indexOf("<think>") + 7, fullText.indexOf("</think>")).trim();
//                finalAnswer = fullText.substring(fullText.indexOf("</think>") + 8).trim();
//            }

//            return String.format("【思考】%s\n【回答】%s", thinkContent, finalAnswer);
            return finalAnswer;

        } catch (Exception e) {
            return "【错误】: " + json;
        }
    }

    /**
     * 缓慢输出字符串：每次打印一个字符，间隔一定时间，模拟打字效果
     */
    private void printSlowly(String message) {
        for (char c : message.toCharArray()) {
            System.out.print(c);
            try {
                Thread.sleep(50); // 每个字符间隔50毫秒，你可以根据需要调整时间
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt(); // 恢复中断状态
            }
        }
        System.out.println(); // 输出完毕后换行
    }

    public static void main(String[] args) {
        DeepSeekClientTest client = new DeepSeekClientTest();
        String recognizedText = "你好，DeepSeek，能告诉我有哪些实时语音识别的模型吗"; // 替换为你的识别结果
        client.processWithDeepSeek(recognizedText);
    }
}
