import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains } from "../helper-hardhat-config";
import { verify } from "../utils/verify";
import { config } from "dotenv";
config();
const deployNFTMarketPlace: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  log("Deploying NFTMarketPlace...");
  const nfTMarketPlace = await deploy("NFTMarketPlace", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations:
      // @ts-ignore
      network.config.blockConfirmations || 1,
  });
  log("Deployed NFTMarketPlace!");
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying NFTMarketPlace...");
    await verify(nfTMarketPlace.address, []);
    log(`Verified NFTMarketPlace.`);
  }
};

export default deployNFTMarketPlace;

deployNFTMarketPlace.tags = [`all`, `nftMarketPlace`];
