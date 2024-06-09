package com.nft.market.nftmarketbackend.repository;

import com.nft.market.nftmarketbackend.pojo.po.NftItemBought;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface INftItemBoughtRepository extends MongoRepository<NftItemBought, String> {

}
