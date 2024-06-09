package com.nft.market.nftmarketbackend.pojo.po;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;


@Data
@NoArgsConstructor
@Document("NftItemListed")
public class NftItemListed {
    @Id
    private String id;
    private String chainId;
    private String marketPlaceAddress;
    private String seller;
    private String nftAddress;
    private String tokenId;
    private String price;
    private Date listedTime;
    private Date updateTime;

    public NftItemListed(String chainId,String marketPlaceAddress, String seller, String nftAddress, String tokenId, String price) {
        this.chainId = chainId;
        this.marketPlaceAddress = marketPlaceAddress;
        this.seller = seller;
        this.nftAddress = nftAddress;
        this.tokenId = tokenId;
        this.price = price;

    }

    public NftItemListed(String chainId,String marketPlaceAddress,String seller, String nftAddress, String tokenId) {
        this.chainId = chainId;
        this.marketPlaceAddress = marketPlaceAddress;
        this.seller = seller;
        this.nftAddress = nftAddress;
        this.tokenId = tokenId;
    }
}
