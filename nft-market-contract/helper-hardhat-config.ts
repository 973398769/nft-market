import { ethers } from "hardhat";
import { config } from "dotenv";
config();
const networkConfig = {
  default: {
    name: "hardhat",
    keepersUpdateInterval: "30",
  },
  31337: {
    name: "localhost",
    subscriptionId: "588",
    gasLane:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // 30 gwei
    keepersUpdateInterval: "30",
    callbackGasLimit: "500000", // 500,000 gas
    jobId: "01cf7cb3ea804c9b95b08e92ff69c19b",
  },
  11155111: {
    name: "sepolia",
    subscriptionId: process.env.SUB_ID,
    gasLane:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // 30 gwei
    keepersUpdateInterval: "30",
    callbackGasLimit: "500000", // 500,000 gas
    vrfCoordinatorV2: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
    jobId: process.env.JOB_ID,
    oracleAddress: process.env.ORACLE_ADDRESS,
    linkTokenAddress: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    upkeepperRegistryAddress: "0xE16Df59B887e3Caa439E0b29B42bA2e7976FD8b2",
  },
  1: {
    name: "mainnet",
    keepersUpdateInterval: "30",
  },
};

const developmentChains = ["hardhat", "localhost"];
const VERIFICATION_BLOCK_CONFIRMATIONS = 6;
// const frontEndContractsFile =
//   "../nextjs-smartcontract-lottery-fcc/constants/contractAddresses.json";
// const frontEndAbiFile =
//   "../nextjs-smartcontract-lottery-fcc/constants/abi.json";

export {
  networkConfig,
  developmentChains,
  VERIFICATION_BLOCK_CONFIRMATIONS,
  //   frontEndContractsFile,
  //   frontEndAbiFile,
};
