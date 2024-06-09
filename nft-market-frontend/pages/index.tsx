import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import { useAccount, useChainId } from "wagmi";
import Api from "../utils/api";
import NFTBox from "../components/NFTBox";

export default function Page() {
  const [listedNfts, setListedNfts] = useState([]);
  const [isWeb3Enabled, setIsWeb3Enabled] = useState(false);
  const { address } = useAccount();
  const chainId = useChainId();
  const getListedNfts = async () => {
    const response = await Api.getListedNftPage(0, 10);
    var resData = response.data;
    if (resData.content && resData.content.length > 0) {
      setListedNfts(resData.content);
    } else {
      setListedNfts([]);
    }
  };
  useEffect(() => {
    //@ts-ignore
    if (typeof window.ethereum !== "undefined") {
      setIsWeb3Enabled(true);
      console.log("Web3 is available");
    } else {
      setIsWeb3Enabled(false);
      console.log("Web3 is not available");
    }
    if (address) {
      //Get all listed ntfs
      getListedNfts();
    }
  }, [address, chainId]);

  return (
    <div className="container mx-auto">
      <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
      <div className="flex flex-wrap">
        {isWeb3Enabled ? (
          listedNfts && listedNfts.length > 0 ? (
            listedNfts.map((nft) => {
              console.log(nft);
              const { price, nftAddress, tokenId, marketPlaceAddress, seller } =
                nft;
              return (
                <div className="m-2" key={`${nftAddress}${tokenId}`}>
                  <NFTBox
                    price={price}
                    nftAddress={nftAddress}
                    tokenId={tokenId}
                    marketPlaceAddress={marketPlaceAddress}
                    seller={seller}
                    key={`${nftAddress}${tokenId}`}
                    getListedNfts={getListedNfts}
                  />
                </div>
              );
            })
          ) : (
            <div className="flex justify-center items-center h-screen w-full">
              <div className="text-center text-4xl text-gray-600">No Ntfs</div>
            </div>
          )
        ) : (
          <div>Web3 Currently Not Enabled</div>
        )}
      </div>
    </div>
  );
}
