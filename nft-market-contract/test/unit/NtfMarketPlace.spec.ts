import { assert, expect } from "chai";
import { network, deployments, ethers, getNamedAccounts } from "hardhat";
import { developmentChains } from "../../helper-hardhat-config";
import { BasicNft, NFTMarketPlace } from "../../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("NftMarketTest", () => {
      let nftMarketPlace: NFTMarketPlace,
        basicNft: BasicNft,
        deployer: string,
        player: SignerWithAddress;
      const price = ethers.utils.parseEther("0.01");
      const Token_Id = 0;
      beforeEach(async () => {
        await deployments.fixture(["all"]);
        // get the deployer
        deployer = (await getNamedAccounts()).deployer;
        player = (await ethers.getSigners())[1];
        nftMarketPlace = await ethers.getContract("NFTMarketPlace");

        basicNft = await ethers.getContract("BasicNft");
        await basicNft.mintNft();
        await basicNft.approve(nftMarketPlace.address, Token_Id);
      });

      it("listed can be bought", async () => {
        const price = ethers.utils.parseEther("2");
        const listTx = await nftMarketPlace.listItem(
          basicNft.address,
          price,
          Token_Id
        );
        await listTx.wait(1);
        // player to buy this nft
        const playerNftMarketPlace = nftMarketPlace.connect(player);
        const buyTx = await playerNftMarketPlace.buyItem(
          basicNft.address,
          Token_Id,
          { value: price }
        );
        await buyTx.wait(1);
        // get the owner of this nft
        const nftOwnerAddress = await basicNft.ownerOf(Token_Id);

        // get the proceeds of deployer
        const proceeds = await nftMarketPlace.callStatic.getProceeds(deployer);

        assert.equal(nftOwnerAddress, player.address);
        assert.equal(proceeds.toString(), price.toString());
      });
    });
