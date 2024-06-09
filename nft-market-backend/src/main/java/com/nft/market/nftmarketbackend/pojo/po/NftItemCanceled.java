package com.nft.market.nftmarketbackend.pojo.po;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@NoArgsConstructor
@Document("NftItemCanceled")
public class NftItemCanceled {
    @Id
    private String id;
    private String chainId;
    private String marketPlaceAddress;
    private String seller;
    private String nftAddress;
    private String tokenId;
    private Date canceledTime;

    public NftItemCanceled(String chainId, String marketPlaceAddress, String sellAddress, String nftAddress, String tokenId) {
        this.chainId = chainId;
        this.marketPlaceAddress = marketPlaceAddress;
        this.seller = sellAddress;
        this.nftAddress = nftAddress;
        this.tokenId = tokenId;
    }
}
