package com.nft.market.nftmarketbackend.repository;

import com.nft.market.nftmarketbackend.pojo.po.NftItemListed;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface INftItemListedRepository extends MongoRepository<NftItemListed, String> {


}
