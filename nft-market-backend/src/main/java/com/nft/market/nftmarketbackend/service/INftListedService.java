package com.nft.market.nftmarketbackend.service;

import com.nft.market.nftmarketbackend.pojo.dto.PageDto;
import com.nft.market.nftmarketbackend.pojo.po.NftItemListed;
import com.nft.market.nftmarketbackend.pojo.vo.PageResponse;
import org.springframework.data.domain.Page;

public interface INftListedService {
    Page<NftItemListed> ListedNftPage(PageDto dto);
}
