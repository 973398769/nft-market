import { useState, useEffect } from "react";
import nftMarketPlaceAbi from "../constants/NftMarketplace.abi.json";
import nftAbi from "../constants/BasicNft.abi.json";
import Image from "next/image";
import {
  Card,
  useNotification,
  //@ts-ignore
} from "@web3uikit/core";
import { UpdateListingModal } from "./UpdateListingProps";

import { useAccount, useChainId, useContractWrite } from "wagmi";
import { ethers } from "ethers";
import api from "@/utils/api";
import { waitForTransaction } from "@wagmi/core";

const truncateStr = (fullStr: string, strLen: number) => {
  if (fullStr.length <= strLen) return fullStr;

  const separator = "...";
  const seperatorLength = separator.length;
  const charsToShow = strLen - seperatorLength;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  return (
    fullStr.substring(0, frontChars) +
    separator +
    fullStr.substring(fullStr.length - backChars)
  );
};

export default function NFTBox({
  price,
  nftAddress,
  tokenId,
  marketPlaceAddress,
  seller,
  getListedNfts,
}: {
  price: string;
  nftAddress: string;
  tokenId: number;
  marketPlaceAddress: string;
  seller: string;
  getListedNfts: Function;
}) {
  const [imageURI, setImageURI] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [showModal, setShowModal] = useState(false);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const dispatch = useNotification();

  const hideModal = () => setShowModal(false);

  async function updateUI() {
    // const hexadecimalString = "0x" + tokenId.toString(16);
    const respData = await api.getNFTMetaData(
      nftAddress,
      parseInt(tokenId.toString(), 16).toString(),
      "0x" + chainId.toString(16)
    );
    const metadata = respData.data.normalized_metadata;
    setImageURI(metadata.image);
    setTokenName(metadata.name);
    setTokenDescription(metadata.description);
  }

  // const handleNewNotification = (
  //   type: "success",
  //   icon?: React.ReactElement
  // ) => {
  //   dispatch({
  //     type,
  //     message: "Somebody messaged you",
  //     title: "New Notification",
  //     icon,
  //     position: "topR",
  //   });
  // };
  useEffect(() => {
    if (isConnected) {
      updateUI();
    }
  }, [isConnected]);

  const {
    data,
    isLoading,
    isSuccess,
    write: buyItems,
  } = useContractWrite({
    address: marketPlaceAddress as `0x${string}`,
    abi: nftMarketPlaceAbi,
    functionName: "buyItem",
    account: address,
    args: [nftAddress, tokenId],
    value: ethers.utils.parseUnits(price, "wei").toBigInt(),
    onError(error) {
      console.log(error);
    },
    async onSettled(hash, error, variables, context) {
      if (hash) {
        const recriptTx = await waitForTransaction(hash);
        dispatch({
          type: "success",
          message: "Item bought!",
          title: "Item Bought",
          position: "topR",
        });
        if (recriptTx.status === "success") {
          await getListedNfts();
        }
      } else {
        dispatch({
          type: "error",
          message: "Item bought Fail!",
          title: "Item Bought Fail",
          position: "topR",
        });
      }
    },
    // onSuccess() {
    //   dispatch({
    //     type: "success",
    //     message: "Item bought!",
    //     title: "Item Bought",
    //     position: "topR",
    //   });
    // },
  });

  const handleCardClick = async () => {
    isOwnedByUser ? setShowModal(true) : buyItems();
  };
  const isOwnedByUser =
    seller === address?.toLocaleLowerCase() || seller === undefined;

  const formattedSellerAddress = isOwnedByUser
    ? "you"
    : truncateStr(seller || "", 15);
  return (
    <div>
      <div>
        {imageURI ? (
          <div>
            <UpdateListingModal
              isVisible={showModal}
              tokenId={tokenId}
              marketPlaceAddress={marketPlaceAddress}
              nftAddress={nftAddress}
              onClose={hideModal}
              imageURI={imageURI}
              nftMarketPlaceAbi={nftMarketPlaceAbi}
              currentPrice={ethers.utils.formatUnits(price, "ether")}
              refreshNftPage={getListedNfts}
            />
            <Card
              title={tokenName}
              description={tokenDescription}
              onClick={handleCardClick}
            >
              <div className="p-2">
                <div className="flex flex-col items-end gap-2">
                  <div>#{tokenId}</div>
                  <div className="italic text-sm">
                    Owned by {formattedSellerAddress}
                  </div>
                  <Image
                    alt={"Owned by " + formattedSellerAddress}
                    loader={() => imageURI}
                    src={imageURI}
                    height="200"
                    width="200"
                  />
                  <div className="font-bold">
                    {ethers.utils.formatUnits(price, "ether")} ETH
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
}
