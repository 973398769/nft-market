import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import { config } from "dotenv";
config();
const main = async () => {
  Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  });
  const stream = {
    chains: [EvmChain.ETHEREUM, EvmChain.POLYGON], // list of blockchains to monitor
    description: "monitor Bobs wallet", // your description
    tag: "bob", // give it a tag
    webhookUrl: "https://YOUR_WEBHOOK_URL", // webhook url to receive events,
    includeNativeTxs: true,
  };

  const newStream = await Moralis.Streams.add(stream);
  const { id } = newStream.toJSON(); // { id: 'YOUR_STREAM_ID', ...newStream }

  //@ts-ignore
  const response = Moralis.Streams.getById({});
  //@ts-ignore
  console.log(response.raw);
  // Now we attach bobs address to the stream
  const address = "0x68b3f12d6e8d85a8d3dbbc15bba9dc5103b888a4";

  // await Moralis.Streams.addAddress({ address, id });
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.log(error);

    process.exit(1);
  });
