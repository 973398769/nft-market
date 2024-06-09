package com.nft.market.nftmarketbackend.service;

import com.nft.market.nftmarketbackend.constans.EventEnum;
import com.nft.market.nftmarketbackend.pojo.dto.MoralisCallBackDataDto;

import java.util.List;

public interface IMoralisCallBackService {
    void handleEvents(List<EventEnum> eventEnums, MoralisCallBackDataDto backDataDto);

    void confirmEvents(MoralisCallBackDataDto moralisCallBackDataDto);
}
