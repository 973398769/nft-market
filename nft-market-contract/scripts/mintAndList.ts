import { ethers } from "hardhat";
import { NFTMarketPlace, BasicNft } from "../typechain";

const mintAndListFunction = async () => {
  const PRICE = ethers.utils.parseEther("2");
  const nfTMarketPlace: NFTMarketPlace = await ethers.getContract(
    "NFTMarketPlace"
  );
  
  const basicNft: BasicNft = await ethers.getContract("BasicNft");
  console.log("Minting NFT...");

  const mintTx = await basicNft.mintNft();
  const mintTxReceipt = await mintTx.wait(1);
  //@ts-ignore
  const tokenId = mintTxReceipt.events[0].args.tokenId;
  console.log("Minted,Get the TokenId :", tokenId.toString());
  console.log("Approving...");
  await basicNft.approve(nfTMarketPlace.address, tokenId);
  console.log("Approved");

  /**
   *  nftAddress: PromiseOrValue<string>,
    price: PromiseOrValue<BigNumberish>,
    tokenId: PromiseOrValue<BigNumberish>,
   */
  console.log("Listing NFT...");
  const listTx = await nfTMarketPlace.listItem(
    basicNft.address,
    PRICE,
    tokenId
  );
  await listTx.wait(1);
  console.log("Listed");
};

mintAndListFunction()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
