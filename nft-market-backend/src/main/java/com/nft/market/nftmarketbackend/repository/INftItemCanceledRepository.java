package com.nft.market.nftmarketbackend.repository;

import com.nft.market.nftmarketbackend.pojo.po.NftItemCanceled;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface INftItemCanceledRepository extends MongoRepository<NftItemCanceled, String> {
}
