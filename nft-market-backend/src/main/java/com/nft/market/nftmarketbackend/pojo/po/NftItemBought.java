package com.nft.market.nftmarketbackend.pojo.po;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@NoArgsConstructor
@Document("NftItemBought")
public class NftItemBought {
    @Id
    private String id;
    private String chainId;
    private String marketPlaceAddress;
    private String buyer;
    private String nftAddress;
    private String tokenId;
    private String price;
    private Date boughtTime;

    public NftItemBought(String chainId, String marketPlaceAddress, String buyer, String nftAddress, String tokenId, String price) {
        this.chainId = chainId;
        this.marketPlaceAddress = marketPlaceAddress;
        this.buyer = buyer;
        this.nftAddress = nftAddress;
        this.tokenId = tokenId;
        this.price = price;
    }
}
