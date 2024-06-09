package com.nft.market.nftmarketbackend.service.impl;

import com.nft.market.nftmarketbackend.pojo.dto.PageDto;
import com.nft.market.nftmarketbackend.pojo.po.NftItemListed;
import com.nft.market.nftmarketbackend.pojo.vo.PageResponse;
import com.nft.market.nftmarketbackend.repository.INftItemListedRepository;
import com.nft.market.nftmarketbackend.service.INftListedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;


@Service
public class NftListedServiceImpl implements INftListedService {
    @Autowired
    private INftItemListedRepository nftItemListedRepository;
    @Override
    public Page<NftItemListed> ListedNftPage(PageDto dto) {
        int page = dto.getPage();
        int pageSize = dto.getPageSize();
        Page<NftItemListed> data = nftItemListedRepository.findAll(PageRequest.of(page, pageSize));
        return data;
    }
}
