package com.nft.market.nftmarketbackend.pojo.dto;

import lombok.Data;

import java.util.List;

@Data
public class MoralisCallBackDataDto {
    private NftApprovals nftApprovals;
    private String streamId;
    private List<Object> nftTransfers;
    private List<Abi> abi;
    private List<Object> txsInternal;
    private List<Object> erc20Approvals;
    private boolean confirmed;
    private List<Txs> txs;
    private int retries;
    private List<Object> nftTokenApprovals;
    private String chainId;
    private List<Object> nativeBalances;
    private List<Object> erc20Transfers;
    private Block block;
    private String tag;
    private List<Logs> logs;

    @Data
    public static class NftApprovals {
        private List<Object> ERC721;
        private List<Object> ERC1155;

    }

    @Data
    public static class Abi {
        private List<Inputs> inputs;
        private String name;
        private boolean anonymous;
        private String type;

        @Data
        public static class Inputs {
            private boolean indexed;
            private String name;
            private String internalType;
            private String type;
        }
    }

    @Data
    public static class Txs {
        private String receiptGasUsed;
        private String transactionIndex;
        private String type;
        private String nonce;
        private String toAddress;
        private String input;
        private String r;
        private String s;
        private String receiptCumulativeGasUsed;
        private String v;
        private String gas;
        private String fromAddress;
        private String value;
        private String hash;
        private String receiptStatus;
        private String gasPrice;

    }

    @Data
    public static class Block {
        private String number;
        private String hash;
        private String timestamp;

    }

    @Data
    public static class Logs {
        private String topic1;
        private String topic2;
        private String logIndex;
        private String address;
        private String topic0;
        private String data;
        private String topic3;
        private String transactionHash;
    }
}
