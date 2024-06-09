import { network } from "hardhat"

export async function moveTimes(times: number) {
    console.log("Moving times ..")
    await network.provider.request({
        method: "evm_increaseTime",
        params: [times],
    })
}
