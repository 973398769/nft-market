package com.nft.market.nftmarketbackend.pojo.dto;

import lombok.Data;

@Data
public class PageDto {
    private int page = 0;
    private int pageSize = 10;
}
