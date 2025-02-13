package com.steam.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Service
public class DeepSeekClient {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public DeepSeekClient() {
        // 假设 DeepSeek 服务运行在本地的 11434 端口
        this.webClient = WebClient.builder().baseUrl("http://localhost:11434").build();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * 根据传入的 prompt 调用 DeepSeek 服务，并将返回的结果逐字（每 50 毫秒一个 token）转为 Flux<String>
     */
    public Flux<String> processWithDeepSeek(String text) {
        // 构造一个长的 prompt 指令
        String largePrompt = "我希望你从专业的厨师角度为我提供建议。我将告诉你我有什么食材，请你根据我说的食材给我推荐菜，并且告诉我菜谱。\n" +
                "\n" +
                "请为我提供三道菜谱，并以 JSON 格式返回。JSON 对象中必须包含以下三个字段：\n" +
                "1. \"dishName\"：菜名，类型为字符串；\n" +
                "2. \"ingredients\"：食材列表，类型为字符串数组，每个元素是一道菜所需的食材；\n" +
                "3. \"recipe\"：菜谱，即详细的做菜方法，类型为字符串，要求步骤清晰、内容详细,步骤之间换行。\n" +
                "\n" +
                "要求：\n" +
                "- 返回的内容只能是 JSON 格式，\n" +
                "- 确保 JSON 格式合法，字段名称和数据类型必须严格按照要求输出。\n" +
                "\n" +
                "示例输出格式：\n" +
                "{\n" +
                "  \"dishName\": \"示例菜名\",\n" +
                "  \"ingredients\": [\"食材1\", \"食材2\", \"食材3\"],\n" +
                "  \"recipe\": \"这里是详细的菜谱，说明每一步操作的内容。\"\n" +
                "}\n" +
                "\n" +
                "请按照以上要求生成三道菜谱的 JSON 数据，recipe控制在300字以内。\n"+
                "我的食材描述如下：";
        String prompt2 = "如果我的要求奇怪，请你同样怪诞的回答，给出你的菜谱。";
        // 将额外的 prompt 拼接在长文本后面
        text = largePrompt + text + prompt2;

        // 用 Map 构造 payload 对象，然后序列化为 JSON 字符串
        Map<String, Object> payloadMap = new HashMap<>();
        payloadMap.put("model", "deepseek-r1:14b");
        payloadMap.put("prompt", text);
        payloadMap.put("stream", true);
        String payload;
        try {
            payload = objectMapper.writeValueAsString(payloadMap);
        } catch (Exception e) {
            throw new RuntimeException("构造 payload JSON 失败", e);
        }

        return webClient.post()
                .uri("/api/generate")
                .header("Content-Type", "application/json")
                .bodyValue(payload)
                .retrieve()
                .bodyToFlux(String.class)
                .map(this::parseDeepSeekResponse)
                // 将每一行文本拆分为 token（既保留单词也保留空格）后逐个延时发送
                .concatMap(line ->
                        Flux.fromArray(line.split("(?<=\\s)|(?=\\s)"))
                                .delayElements(Duration.ofMillis(1))
                );
    }

    /**
     * 解析 DeepSeek 返回的 JSON 行
     * 此处简单处理，如检测到 <think> 和 </think> 可返回提示文本
     */
    private String parseDeepSeekResponse(String json) {
        try {
            JsonNode jsonNode = objectMapper.readTree(json);
            String fullText = jsonNode.path("response").asText();

            // 示例：如果返回文本中包含 <think> 或 </think>，返回特定提示文本
            if (fullText.contains("<think>")) {
                return "思考:\n";
            } else if (fullText.contains("</think>")) {
                return "答案:";
            }
            return fullText;

        } catch (Exception e) {
            return "【错误】: " + json;
        }
    }
}
