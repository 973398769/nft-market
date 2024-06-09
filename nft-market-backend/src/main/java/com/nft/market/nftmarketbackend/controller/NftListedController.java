package com.nft.market.nftmarketbackend.controller;


import com.alibaba.fastjson.JSON;
import com.nft.market.nftmarketbackend.pojo.dto.PageDto;
import com.nft.market.nftmarketbackend.pojo.po.NftItemListed;
import com.nft.market.nftmarketbackend.pojo.vo.PageResponse;
import com.nft.market.nftmarketbackend.pojo.vo.Result;
import com.nft.market.nftmarketbackend.service.INftListedService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Log4j2
@RestController
@RequestMapping("/nft/listed")
public class NftListedController {
    @Autowired
    private INftListedService nftListedService;

    @GetMapping("/listedPage")
    public Result<Page<NftItemListed>> ListedNftPage(PageDto dto) {
        log.info("Parameters :{}", JSON.toJSONString(dto));
        Page<NftItemListed> listedNftPage = nftListedService.ListedNftPage(dto);
        return Result.ok(listedNftPage);
    }
}
