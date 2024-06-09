package com.nft.market.nftmarketbackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // 允许的来源，可以使用通配符 * 表示允许任意来源
        config.addAllowedOrigin("*");
        
        // 允许的 HTTP 方法
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");

        // 允许的请求头
        config.addAllowedHeader("*");

        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}