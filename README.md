# NFT-MARKETPLACE

Nft Marketplace is a market place for selling nfts. It contains 4 parts.

1. The first is for selling nfts, you can list your nfts and sell them. ✅
2. The second is for cancelling, you can cancel your listed items. ✅
3. The third is for buying, you can buy the nfts anothers listed. ✅
4. The forth is for withdraw, you can get your proceeds for selling your nft. ✅

## Features

- Frontend server build by Next.js, Backend server build by Java ,Contracts build by Solidity.
- Log in Nft marketplace with digital wallet using Walletconnect.
- All transactions are managed and send by [Wagmi](https://wagmi.sh/).
- Used Stream hooks of Moralis to listen to the events of transaction and callback the Backend server.
- Fecth the metadatas of nft using NFT'S API from [Moralis](https://docs.moralis.io/).
- Integracted with the Mongodb to store events data that from Stream hooks of Moralis.
- Test and deploy contracts with Hardhat.

## Quick Start

### Step1:Run Backend server

We need to run the Backend server at first.We need fill the apikey of Moralis in the [application.properties](https://github.com/TechPlanB/NFT-MARKETPLACE/blob/main/nft-market-backend/src/main/resources/application.properties) of Backend server instead example value of [MORALIS_API_KEY](https://github.com/TechPlanB/NFT-MARKETPLACE/blob/main/nft-market-backend/src/main/resources/application.properties#L5).Please access to [Moralis](https://admin.moralis.io/) then regirster if you don't have the apikey.after that.Like this we can run with the Backend server.

### Step2:Complie the contracts for Apis of contract

For Apis of contract,We can use [Remix](https://remix.ethereum.org/) to complie the contracts.

### Step3:Create the Stream hook

To process this step we should login in the Moralis. creating the Stream hook is for listening to events of contract(Of course you can create the Stream hook via coding,but here we directly create on the website).click the Stream tab then create new Stream,this the creation page you need fill the address and abi of NftMarketplace
and choose the all events needing to listen to.You can refer to the videos below.
![ezgif com-video-to-gif](https://github.com/TechPlanB/NFT-MARKETPLACE/blob/assets/assets/264350265-4848329a-3475-4611-8227-6b851b0449d6.gif)
![ezgif com-video-to-gif (1)](https://github.com/TechPlanB/NFT-MARKETPLACE/blob/assets/assets/264350564-4378d0b6-3a58-4535-91b1-4f3955e73b61.gif)
![ezgif com-video-to-gif (2)](https://github.com/TechPlanB/NFT-MARKETPLACE/blob/assets/assets/264350600-a25e4687-840a-4b42-bb8a-fe1e80497865.gif)
![ezgif com-video-to-gif (3)](https://github.com/TechPlanB/NFT-MARKETPLACE/blob/assets/assets/7QA7xOjA1d.jpg)

### Step4:Run Frontend server

Create an .env file and copy the content of [.env.example](https://github.com/TechPlanB/NFT-MARKETPLACE/blob/main/nft-market-frontend/.env.example),an then revise the value for properties of .env file. [NEXT_PUBLIC_SERVER_URL](https://github.com/TechPlanB/NFT-MARKETPLACE/blob/main/nft-market-frontend/.env.example#L1) is the url of your Backend server.[NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID](https://github.com/TechPlanB/NFT-MARKETPLACE/blob/main/nft-market-frontend/.env.example#L2) is your projectId of WalletConnect, you should login and get your projectId from [WalletConnect](https://cloud.walletconnect.com/) if you didn't have logined [WalletConnect](https://cloud.walletconnect.com/).
