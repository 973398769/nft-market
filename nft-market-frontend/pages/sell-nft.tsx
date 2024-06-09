import styles from "../styles/Home.module.css";
//@ts-ignore
import { Form, useNotification, Button } from "@web3uikit/core";
import { ethers } from "ethers";
import nftAbi from "../constants/BasicNft.abi.json";
import nftMarketplaceAbi from "../constants/NftMarketplace.abi.json";
import networkMapping from "../constants/networkMapping.json";
import { useEffect, useState } from "react";
import { useContractWrite, useAccount, useChainId } from "wagmi";
import { waitForTransaction } from "@wagmi/core";
import { BigNumber } from "ethers";
import { readContract } from "@wagmi/core";

interface NetworkMapping {
  [key: string]: { NftMarketplace: any[] };
}

export default function Home() {
  const [marketplaceAddress, setMarketPlaceAddress] = useState("");
  const [nftPrice, setNftPrice] = useState("");
  const { address: account, isConnected } = useAccount();

  let chainId = useChainId();

  const dispatch = useNotification();
  const [proceeds, setProceeds] = useState("0");

  const { write: approve } = useContractWrite({
    async onSuccess(hash, variables) {
      const transactionReceipt = await waitForTransaction(hash);
      console.log("transactionReceipt", { transactionReceipt });
      if (transactionReceipt.status === "success") {
        if (variables.args) {
          const nftAddress = variables.address;
          const tokenId = variables.args[1];
          handleApproveSuccess(
            nftAddress!.toString(),
            tokenId!.toString(),
            nftPrice
          );
        }
      }
    },
    onError(error, variables, context) {
      console.log(error);
    },
  });

  async function approveAndList(data: any) {
    // const { hash} = await writeContract()
    console.log("Approving...");
    const nftAddress = data.data[0].inputResult;
    const tokenId = data.data[1].inputResult;
    const price = ethers.utils
      .parseUnits(data.data[2].inputResult, "ether")
      .toString();
    setNftPrice(price);
    approve({
      //@ts-ignore
      account: account,
      abi: nftAbi,
      address: nftAddress,
      functionName: "approve",
      args: [marketplaceAddress, tokenId],
    });
  }

  const { write: listNft } = useContractWrite({
    onSuccess: async (hash) => {
      {
        const transactionReceipt = await waitForTransaction(hash);
        console.log("transactionReceipt", { transactionReceipt });
        if (transactionReceipt.status === "success") {
          handleListSuccess();
        }
      }
    },
    onError: (error: Error) => console.log(error),
  });

  function handleApproveSuccess(
    nftAddress: string,
    tokenId: string,
    price: string
  ) {
    console.log("Ok! Now time to list");
    listNft({
      //@ts-ignore
      abi: nftMarketplaceAbi,
      address: marketplaceAddress,
      account: account,
      functionName: "listItem",
      args: [nftAddress, price, tokenId],
    });
  }

  async function handleListSuccess() {
    dispatch({
      type: "success",
      message: "NFT listing",
      title: "NFT listed",
      position: "topR",
    });
  }

  const handleWithdrawSuccess = async () => {
    setProceeds("0");
    dispatch({
      type: "success",
      message: "Withdrawing proceeds",
      position: "topR",
    });
  };

  async function setupUI(marketplaceAddr: `0x${string}`) {
    const data = await readContract({
      address: marketplaceAddr,
      abi: nftMarketplaceAbi,
      functionName: "getProceeds",
      args: [account],
    });

    const dataStr = (data as BigNumber).toString();
    const suceeds = ethers.utils.formatUnits(dataStr, "ether");
    console.log(suceeds);
    setProceeds(suceeds);
  }

  const { write: withDrawProceeds } = useContractWrite({
    abi: nftMarketplaceAbi,
    address: marketplaceAddress as `0x${string}`,
    account: account,
    functionName: "withDrawProceeds",
    args: [],
    onError: (error) => console.log(error),
    async onSuccess(data) {
      const receipt = await waitForTransaction(data);
      if (receipt.status === "success") {
        handleWithdrawSuccess();
      }
    },
  });

  useEffect(() => {
    const network = (networkMapping as NetworkMapping)[chainId.toString()];
    if (
      network &&
      network.NftMarketplace &&
      network.NftMarketplace.length > 0
    ) {
      const marketplaceAddr = network.NftMarketplace[0];
      console.log("marketplaceAddr", marketplaceAddr);
      setMarketPlaceAddress(marketplaceAddr);

      if (isConnected) {
        setupUI(marketplaceAddr);
      }
    } else {
      setMarketPlaceAddress("");
    }
  }, [proceeds, account, isConnected, chainId]);

  return (
    <>
      {marketplaceAddress && marketplaceAddress.trim() ? (
        <div className={styles.container}>
          <Form
            onSubmit={approveAndList}
            data={[
              {
                name: "NFT Address",
                type: "text",
                inputWidth: "50%",
                value: "",
                key: "nftAddress",
              },
              {
                name: "Token ID",
                type: "number",
                value: "",
                key: "tokenId",
              },
              {
                name: "Price (in ETH)",
                type: "number",
                value: "",
                key: "price",
              },
            ]}
            title="Sell your NFT!"
            id="Main Form"
          />
          <div>Withdraw {proceeds} ETH proceeds</div>
          {proceeds != "0.0" ? (
            <Button
              onClick={() => {
                withDrawProceeds({
                  //@ts-ignore
                  abi: nftMarketplaceAbi,
                  address: marketplaceAddress,
                  account: account,
                  functionName: "withDrawProceeds",
                  args: [],
                });
              }}
              text="Withdraw"
              type="button"
            />
          ) : (
            <div>No proceeds detected</div>
          )}
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen w-full">
          <div className="text-center text-4xl text-gray-600">
            Temporarily only support Sepolia network,Please switch to Sepolia!
          </div>
        </div>
      )}
    </>
  );
}
