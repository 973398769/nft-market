package com.nft.market.nftmarketbackend.pojo.vo;

import lombok.Data;

import java.util.List;

@Data
public class PageResponse<T> {
    private List<T> data;
    private long total;
    private int page;
    private int pageSize;
}