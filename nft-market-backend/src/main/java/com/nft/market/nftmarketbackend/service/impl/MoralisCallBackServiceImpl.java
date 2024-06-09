package com.nft.market.nftmarketbackend.service.impl;

import com.nft.market.nftmarketbackend.constans.EventEnum;
import com.nft.market.nftmarketbackend.pojo.dto.MoralisCallBackDataDto;
import com.nft.market.nftmarketbackend.pojo.po.NftItemBought;
import com.nft.market.nftmarketbackend.pojo.po.NftItemCanceled;
import com.nft.market.nftmarketbackend.pojo.po.NftItemListed;
import com.nft.market.nftmarketbackend.repository.INftItemBoughtRepository;
import com.nft.market.nftmarketbackend.repository.INftItemCanceledRepository;
import com.nft.market.nftmarketbackend.repository.INftItemListedRepository;
import com.nft.market.nftmarketbackend.service.IMoralisCallBackService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.stereotype.Service;
import org.web3j.utils.Numeric;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Log4j2
@Service
public class MoralisCallBackServiceImpl implements IMoralisCallBackService {
    @Autowired
    private INftItemListedRepository nftItemListedRepository;
    @Autowired
    private INftItemCanceledRepository nftItemCanceledRepository;
    @Autowired
    private INftItemBoughtRepository nftItemBoughtRepository;

    @Override
    public void handleEvents(List<EventEnum> eventEnums, MoralisCallBackDataDto backDataDto) {

        for (int i = 0; i < eventEnums.size(); i++) {
            EventEnum event = eventEnums.get(i);
            String chainId = backDataDto.getChainId();
            List<MoralisCallBackDataDto.Logs> logs = backDataDto.getLogs();
            MoralisCallBackDataDto.Logs callBackLog = logs.get(i);
            String timestamp = backDataDto.getBlock().getTimestamp();
            Date operationTime = new Date(Long.valueOf(timestamp) * 1000);


            String topic1 = callBackLog.getTopic1();
            String topic2 = callBackLog.getTopic2();
            String topic3 = callBackLog.getTopic3();
            String data = callBackLog.getData();
            String address = callBackLog.getAddress();
            String operatorAddress = Numeric.toHexStringWithPrefixSafe(Numeric.toBigInt(topic1));
            String nftAddress = Numeric.toHexStringWithPrefixSafe(Numeric.toBigInt(topic2));
            String tokenId = Numeric.toHexStringWithPrefixSafe(Numeric.toBigInt(topic3));
            if (event.equals(EventEnum.ItemListed)) {
                //ADD LISTED DATA
                String price = Numeric.toBigInt(data).toString();
                NftItemListed nftItemListed = new NftItemListed(chainId, address, operatorAddress, nftAddress, tokenId, price);
                log.info("Received the seller:{} , \nnftAddress:{} ,\ntokenId:{},\nprice:{}", operatorAddress, nftAddress, tokenId, price);


                NftItemListed query = new NftItemListed();
                query.setChainId(chainId);
                query.setNftAddress(nftAddress);
                query.setTokenId(tokenId);
                Optional<NftItemListed> optional = nftItemListedRepository.findOne(Example.of(query));
                if (optional.isPresent()) { //Update
                    NftItemListed one = optional.get();
                    String id = one.getId();
                    nftItemListed.setId(id);
                    nftItemListed.setUpdateTime(operationTime);
                    log.info("Updating NFT data to Mongodb.");
                } else { //Save
                    nftItemListed.setListedTime(operationTime);
                    log.info("Saving NFT data into Mongodb.");
                }
                nftItemListedRepository.save(nftItemListed);
                log.info("Operated!");

            } else if (event.equals(EventEnum.BuyItem)) {

                //ADD BOUGHT DATA
                String price = Numeric.toBigInt(data).toString();
                NftItemBought nftItemBought = new NftItemBought(chainId, address, operatorAddress, nftAddress, tokenId, price);
                nftItemBought.setBoughtTime(operationTime);
                log.info("Received the buyer:{} , \nnftAddress:{} ,\ntokenId:{},\nprice:{}", operatorAddress, nftAddress, tokenId, price);


                NftItemBought query = new NftItemBought();
                query.setChainId(chainId);
                query.setNftAddress(nftAddress);
                query.setTokenId(tokenId);
                query.setBuyer(operatorAddress);
                Optional<NftItemBought> optional = nftItemBoughtRepository.findOne(Example.of(query));
                if(optional.isPresent()){
                    log.info("Updating NFT bought data to Mongodb.");
                    NftItemBought one = optional.get();
                    nftItemBought.setId(one.getId());

                }else{
                    log.info("Saving NFT bought data into Mongodb.");
                }
                log.info("Saving NFT bought data into Mongodb.");
                nftItemBoughtRepository.save(nftItemBought);
                log.info("Operated!");
                //REMOVE THE LISTED DATA
                removeListedData(callBackLog, chainId);
            } else if (event.equals(EventEnum.CancelListing)) {
                //ADD LISTED DATA
                NftItemCanceled nftItemCanceled = new NftItemCanceled(chainId, address, operatorAddress, nftAddress, tokenId);
                nftItemCanceled.setCanceledTime(operationTime);
                log.info("Received the seller:{} , \nnftAddress:{} ,\ntokenId:{}", operatorAddress, nftAddress, tokenId);
                NftItemCanceled query = new NftItemCanceled();
                query.setChainId(chainId);
                query.setNftAddress(nftAddress);
                query.setTokenId(tokenId);
                query.setSeller(operatorAddress);
                Optional<NftItemCanceled> optional = nftItemCanceledRepository.findOne(Example.of(query));
                if(optional.isPresent()){
                    log.info("Updating the Canceled data to Mongodb...");
                    String id = optional.get().getId();
                    nftItemCanceled.setId(id);
                }else{
                    log.info("Saving the Canceled data into Mongodb...");
                }
                nftItemCanceledRepository.save(nftItemCanceled);
                log.info("Operated!");
                //REMOVE THE LISTED DATA
                removeListedData(callBackLog, chainId);
            }
        }


    }

    @Override
    public void confirmEvents(MoralisCallBackDataDto moralisCallBackDataDto) {

    }

    private void removeListedData(MoralisCallBackDataDto.Logs callBackLog, String chainId) {
        log.info("Deleting the listed NFT data.");
        String topic2 = callBackLog.getTopic2();
        String topic3 = callBackLog.getTopic3();
        String nftAddress = Numeric.toHexStringWithPrefixSafe(Numeric.toBigInt(topic2));
        String tokenId = Numeric.toHexStringWithPrefixSafe(Numeric.toBigInt(topic3));
        NftItemListed query = new NftItemListed();
        query.setChainId(chainId);
        query.setNftAddress(nftAddress);
        query.setTokenId(tokenId);
        Optional<NftItemListed> optional = nftItemListedRepository.findOne(Example.of(query));
        NftItemListed one = optional.get();
        nftItemListedRepository.deleteById(one.getId());
        log.info("Deleted!");
    }

}
