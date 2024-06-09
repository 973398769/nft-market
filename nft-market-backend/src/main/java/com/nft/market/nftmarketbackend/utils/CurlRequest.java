package com.nft.market.nftmarketbackend.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class CurlRequest {

    public static String curl(String url,String apiKey){
        String returnString = "";
        try {
            // 构建命令
            ProcessBuilder processBuilder = new ProcessBuilder(
                    "curl",
                    "--request", "GET",
                    "--url", url,
                    "--header", "accept: application/json",
                    "--header", "X-API-Key: "+apiKey
            );

            // 设置工作目录
            processBuilder.directory(null);

            // 启动进程
            Process process = processBuilder.start();

            // 读取输出
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder builder = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
                builder.append(line);
            }

            // 等待进程完成
            int exitCode = process.waitFor();
            System.out.println("Exit code: " + exitCode);
            return builder.toString();

        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
        return url;
    }
}
