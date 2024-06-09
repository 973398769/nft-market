import { run } from "hardhat";
async function verify(contractAddress: string, args: any[]) {
  try {
    console.log("Verifying contract...");
    //执行command
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
    console.log(
      `This contract address ${contractAddress} has passed the verification`
    );
  } catch (error) {
    console.error(error);
  }
}

export { verify };
