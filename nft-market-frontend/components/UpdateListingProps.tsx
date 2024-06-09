import {
  Modal,
  useNotification,
  Input,
  Illustration,
  Button,
  //@ts-ignore
} from "@web3uikit/core";
import { useState } from "react";
import { ethers } from "ethers";
import Image from "next/image";
import { useContractWrite, useAccount } from "wagmi";
import { Narrow, Abi } from "abitype";
import { waitForTransaction } from "@wagmi/core";

export interface UpdateListingProps {
  isVisible: boolean;
  onClose: () => void;
  nftMarketPlaceAbi: object;
  marketPlaceAddress: string;
  nftAddress: string;
  tokenId: number;
  imageURI: string | undefined;
  currentPrice?: string | undefined;
  refreshNftPage: Function;
}

export const UpdateListingModal = ({
  isVisible,
  onClose,
  nftMarketPlaceAbi,
  marketPlaceAddress,
  nftAddress,
  tokenId,
  imageURI,
  currentPrice,
  refreshNftPage,
}: UpdateListingProps) => {
  const dispatch = useNotification();
  const { address } = useAccount();
  const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState<
    string | undefined
  >();
  const handleUpdateListingSuccess = async (hash: any) => {
    const receiptTx = await waitForTransaction(hash);
    if (receiptTx.status === "success") {
      dispatch({
        type: "success",
        message: "Listing updated successfully",
        title: "Listing Updated - please refresh",
        position: "topR",
      });
      onClose && onClose();
      setPriceToUpdateListingWith("0");
      await refreshNftPage();
    } else {
      dispatch({
        type: "error",
        message: "Listing updated unsuccessfully",
        title: "Listing updated unsuccessfully",
        position: "topR",
      });
    }
  };

  const handleCancelListingSuccess = async (hash: any) => {
    const receiptTx = await waitForTransaction(hash);
    if (receiptTx.status === "success") {
      dispatch({
        type: "success",
        message: "Listing canceled successfully",
        title: "Listing Canceled",
        position: "topR",
      });
      onClose && onClose();
      await refreshNftPage();
    } else {
      dispatch({
        type: "error",
        message: "Listing canceled unsuccessfully",
        title: "Listing canceled unsuccessfully",
        position: "topR",
      });
    }
  };

  const {
    data: data1,
    isLoading: isLoading1,
    isSuccess: isSuccess1,
    write: cancelListing,
  } = useContractWrite({
    address: marketPlaceAddress as `0x${string}`,
    abi: nftMarketPlaceAbi as Narrow<Abi>,
    functionName: "cancelListing",
    account: address,
    args: [nftAddress, tokenId],
    onError(error) {
      console.log(error);
    },
    async onSuccess(hash) {
      await handleCancelListingSuccess(hash);
    },
  });

  const {
    data,
    isLoading,
    isSuccess,
    write: updateListing,
  } = useContractWrite({
    address: marketPlaceAddress as `0x${string}`,
    abi: nftMarketPlaceAbi as Narrow<Abi>,
    functionName: "updateListing",
    account: address,
    args: [
      nftAddress,
      tokenId,
      ethers.utils.parseEther(priceToUpdateListingWith || "0"),
    ],
    onError(error) {
      console.log(error);
    },
    async onSettled(hash) {
      if (hash) {
        await handleUpdateListingSuccess(hash);
      } else {
        dispatch({
          type: "error",
          message: "Listing updated unsuccessfully",
          title: "Listing updated unsuccessfully",
          position: "topR",
        });
      }
    },
  });

  return (
    <Modal
      isVisible={isVisible}
      id="regular"
      onCancel={onClose}
      onCloseButtonPressed={onClose}
      onOk={() => updateListing()}
      title="NFT Details"
      okText="Save New Listing Price"
      cancelText="Leave it"
      isOkDisabled={!priceToUpdateListingWith}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <p className="p-4 text-lg">
            This is your listing. You may either update the listing price or
            cancel it.
          </p>
          <div className="flex flex-col items-end gap-2 border-solid border-2 border-gray-400 rounded p-2 w-fit">
            <div>#{tokenId}</div>
            {imageURI ? (
              <Image
                alt=""
                loader={() => imageURI}
                src={imageURI}
                height="200"
                width="200"
              />
            ) : (
              <Illustration height="180px" logo="lazyNft" width="100%" />
            )}
            <div className="font-bold">{currentPrice} ETH</div>
          </div>
          <Input
            label="Update listing price in L1 Currency (ETH)"
            name="New listing price"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setPriceToUpdateListingWith(event.target.value);
            }}
            type="number"
          />
          or
          <Button
            id="cancel-listing"
            onClick={() => cancelListing()}
            text="Cancel Listing"
            theme="colored"
            color="red"
            type="button"
          />
        </div>
      </div>
    </Modal>
  );
};
