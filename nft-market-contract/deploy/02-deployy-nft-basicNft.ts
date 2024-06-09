import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains } from "../helper-hardhat-config";
import { verify } from "../utils/verify";
const deployBasicNft: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  console.log("Deploying BasicNTF...");
  const nfTMarketPlace = await deploy("BasicNft", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations:
      // @ts-ignore
      network.config.blockConfirmations || 1,
  });

  console.log("Deployed BasicNTF!");

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying...");
    await verify(nfTMarketPlace.address, []);
    log(`Verified BasicNft.`);
  }
};

export default deployBasicNft;
deployBasicNft.tags = [`all`, `basicNft`];
