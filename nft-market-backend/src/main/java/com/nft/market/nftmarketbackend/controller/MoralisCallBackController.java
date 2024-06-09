package com.nft.market.nftmarketbackend.controller;

import com.alibaba.fastjson.JSON;
import com.nft.market.nftmarketbackend.constans.EventEnum;
import com.nft.market.nftmarketbackend.pojo.dto.MoralisCallBackDataDto;
import com.nft.market.nftmarketbackend.pojo.vo.Result;
import com.nft.market.nftmarketbackend.service.IMoralisCallBackService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.web3j.abi.EventEncoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Event;
import org.web3j.abi.datatypes.Uint;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@Log4j2
@RestController
@RequestMapping("/moralis-stream/test1")
public class MoralisCallBackController {

    @Autowired
    private IMoralisCallBackService moralisCallBackService;
    private ConcurrentHashMap<String, EventEnum> eventMap = new ConcurrentHashMap<>();

    @PostMapping("/receive")
    public Result receive(@RequestBody MoralisCallBackDataDto moralisCallBackDataDto) {
        log.info("Received the events' info :{}", JSON.toJSONString(moralisCallBackDataDto));
        log.info("Finding out if the log is confirmed :{}",moralisCallBackDataDto.isConfirmed());
        if(!moralisCallBackDataDto.isConfirmed()){
            log.info("Starting to compute then figure out which kind event it is.");
            List<EventEnum> eventEnums = computeEventType(moralisCallBackDataDto.getLogs());
            log.info("Get events :{}.", eventEnums);
            moralisCallBackService.handleEvents(eventEnums, moralisCallBackDataDto);
            return Result.ok();
        }else{
            /**
             * Chain	Chain-Id(HEX)	Internal-Transaction-Supported-Note	  Blocks-until-confirmed
             * ETH	        0x1	                        ✅ YES		                         12
             * GOERLI	    0x5	                        ✅ YES		                         12
             * SEPOLIA	  0xaa36a7	                    ✅ YES		                         18
             */
            log.info("Transactions was confirmed by multiple blocks!");
        }
        return Result.ok();
    }

    //compute the event hash sign and return the event type
    List<EventEnum> computeEventType(List<MoralisCallBackDataDto.Logs> logs) {
        List<EventEnum> eventEnums = new ArrayList<>();
        if (eventMap.size() < 1) {
            initEventMap();
        }
        logs.forEach(log -> {
            String topic0 = log.getTopic0();
            EventEnum eventEnum = eventMap.get(topic0);
            eventEnums.add(eventEnum);
        });
        return eventEnums;
    }



    void initEventMap() {
        List<TypeReference<?>> itemListedParameters = new ArrayList<>();
        itemListedParameters.add(new TypeReference<Address>(true) {
        });
        itemListedParameters.add(new TypeReference<Address>(true) {
        });
        itemListedParameters.add(new TypeReference<Uint>(true) {
        });
        itemListedParameters.add(new TypeReference<Uint>(false) {
        });
        Event itemListedEvent = new Event("ItemListed", itemListedParameters);
        eventMap.put(EventEncoder.encode(itemListedEvent), EventEnum.ItemListed);

        /**
         *     event BuyItem(
         *         address indexed buyer,
         *         address indexed nftAddress,
         *         uint indexed tokenId,
         *         uint price
         *     );
         */

        List<TypeReference<?>> buyItemParameters = new ArrayList<>();
        buyItemParameters.add(new TypeReference<Address>(true) {
        });
        buyItemParameters.add(new TypeReference<Address>(true) {
        });
        buyItemParameters.add(new TypeReference<Uint>(true) {
        });
        buyItemParameters.add(new TypeReference<Uint>(false) {
        });
        Event buyItemEvent = new Event("BuyItem", buyItemParameters);
        eventMap.put(EventEncoder.encode(buyItemEvent), EventEnum.BuyItem);


        /**
         *   event CancelListing(address seller, address nftAddress, uint tokenId);
         */
        List<TypeReference<?>> cancelListingParameters = new ArrayList<>();
        cancelListingParameters.add(new TypeReference<Address>(true) {
        });
        cancelListingParameters.add(new TypeReference<Address>(true) {
        });
        cancelListingParameters.add(new TypeReference<Uint>(true) {
        });
        Event cancelListingEvent = new Event("CancelListing", cancelListingParameters);
        eventMap.put(EventEncoder.encode(cancelListingEvent), EventEnum.CancelListing);
    }

}
