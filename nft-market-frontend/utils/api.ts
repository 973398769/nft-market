import axios, { AxiosResponse } from "axios";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL!;

class Api {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // 封装获取 NFT Metadata 的请求
  async getNFTMetaData(
    nftAddress: string,
    tokenId: string,
    chainId: string
  ): Promise<AxiosResponse<any>> {
    const url = `${this.baseUrl}/nft/metaData/getNFTMetadata`;
    try {
      const response = await axios.get(url, {
        params: { nftAddress, tokenId, chainId },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // 封装获取 all listed NFTs 的请求
  async getListedNftPage(
    page: number,
    pageSize: number
  ): Promise<AxiosResponse<any>> {
    const url = `${this.baseUrl}/nft/listed/listedPage`;
    try {
      const response = await axios.get(url, {
        params: { page, pageSize },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new Api(serverUrl);
