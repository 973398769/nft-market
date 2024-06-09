package com.nft.market.nftmarketbackend.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.nft.market.nftmarketbackend.pojo.vo.Result;
import com.nft.market.nftmarketbackend.utils.CurlRequest;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@Log4j2
@RestController
@RequestMapping("/nft/metaData")
public class GetNftMetaDataController {

    @Autowired
    private RestTemplate restTemplate = new RestTemplate();

    @Value("${MORALIS_API_KEY}")
    private String MORALIS_API_KEY;
    @Value("${RESYNC_NFT_METADATA_URL}")
    private String RESYNC_NFT_METADATA_URL;
    @Value("${GET_NFT_METADATA_URL}")
    private String GET_NFT_METADATA_URL;


    @GetMapping("/resyncNftMetaData")
    public Result resyncNftMetaData(@RequestParam("nftAddress") String nftAddress, @RequestParam("tokenId") String tokenId, @RequestParam("chainId") String chainId) {
        log.info(MORALIS_API_KEY);
        log.info("Resyncing Nft MetaData...");
        log.info("nftAddress:[{}],tokenId:{},chainId:{}",nftAddress,tokenId,chainId);
        JSONObject obj = JSON.parseObject(CurlRequest.curl(buildDynamicUrl(RESYNC_NFT_METADATA_URL, nftAddress, tokenId, chainId), MORALIS_API_KEY));
        log.info("Resynced!");
        return Result.ok(obj);
    }

    @GetMapping("/getNFTMetadata")
    public Result getNFTMetadata(@RequestParam("nftAddress") String nftAddress, @RequestParam("tokenId") String tokenId, @RequestParam("chainId") String chainId) {
        log.info(MORALIS_API_KEY);
        log.info("Getting NFT Metadata...");
        log.info("nftAddress:[{}],tokenId:{},chainId:{}",nftAddress,tokenId,chainId);
        JSONObject obj = JSON.parseObject(CurlRequest.curl(buildDynamicUrl(GET_NFT_METADATA_URL, nftAddress, tokenId, chainId), MORALIS_API_KEY));
        log.info("Got!");
        return Result.ok(obj);
    }

    private String buildDynamicUrl(String url, String address, String id, String chain) {
        return url.replace("{address}", address)
                .replace("{id}", id).replace("{chain}", chain);
    }

}
