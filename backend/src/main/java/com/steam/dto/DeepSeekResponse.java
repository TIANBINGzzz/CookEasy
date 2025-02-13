package com.steam.dto;

import lombok.Data;

@Data
public class DeepSeekResponse {
    private String model;
    private String created_at;
    private String response;  // 这里存储回答内容
    private boolean done;
    private String done_reason;
}
