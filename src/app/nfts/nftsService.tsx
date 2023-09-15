import { Alchemy, BigNumber, Nft, OwnedNft } from "alchemy-sdk";
import {
  GetFloorPriceResponse,
  GetNftsForOwnerOptions,
  NftAttributeRarity,
  NftMetadataBatchToken,
} from "alchemy-sdk";
import {
  ContractAddress,
  NftTokenId,
  Table,
  WalletAddress,
} from "@/app/types"

export interface NftMetadata {
  name: string;
  gatewayUrl?: string;
  thumbnailUrl?: string;
}

export interface NftTable {
  setNft(contractAddress: ContractAddress, tokenId: NftTokenId, nft: Nft): void;
  getNft(
    contractAddress: ContractAddress,
    tokenId: NftTokenId,
  ): Nft | undefined;
}

export class NftTableImpl implements NftTable {
  private readonly nftsByAddressToken: Table<ContractAddress, NftTokenId, Nft>;

  constructor() {
    this.nftsByAddressToken = {};
  }

  setNft(
    contractAddress: ContractAddress,
    tokenId: NftTokenId,
    nft: Nft,
  ): void {
    if (!this.nftsByAddressToken[contractAddress]) {
      this.nftsByAddressToken[contractAddress] = {};
    }
    this.nftsByAddressToken[contractAddress][tokenId] = nft;
  }

  getNft(
    contractAddress: ContractAddress,
    tokenId: NftTokenId,
  ): Nft | undefined {
    return this.nftsByAddressToken[contractAddress]?.[tokenId];
  }
}

export interface NftsService {
  getNfts(params: NftMetadataBatchToken[]): Promise<NftTable>;
  getOwnerNfts(
    owner: WalletAddress,
    options?: Pick<GetNftsForOwnerOptions, "includeFilters" | "excludeFilters">,
  ): Promise<OwnedNft[]>;

  getRarity(
    address: ContractAddress,
    tokenId: NftTokenId,
  ): Promise<NftAttributeRarity[]>;

  getFloorPrice(contract: ContractAddress): Promise<GetFloorPriceResponse>;
}

export class NftsServiceImpl implements NftsService {
  constructor(private readonly alchemy: Alchemy) {}

  public async getNfts(params: NftMetadataBatchToken[]): Promise<NftTable> {
    const response = await this.alchemy.nft.getNftMetadataBatch(params);
    const table = new NftTableImpl();

    for (const nft of response) {
      table.setNft(nft.contract.address, nft.tokenId, nft);
    }

    return table;
  }

  public async getOwnerNfts(
    owner: WalletAddress,
    options?: Pick<GetNftsForOwnerOptions, "includeFilters" | "excludeFilters">,
  ): Promise<OwnedNft[]> {
    const response = await this.alchemy.nft.getNftsForOwner(owner, {
      includeFilters: options?.includeFilters,
      excludeFilters: options?.excludeFilters,
    });
    return response.ownedNfts;
  }

  public async getRarity(
    address: ContractAddress,
    tokenId: NftTokenId,
  ): Promise<NftAttributeRarity[]> {
    return this.alchemy.nft.computeRarity(address, BigNumber.from(tokenId));
  }

  public async getFloorPrice(
    address: ContractAddress,
  ): Promise<GetFloorPriceResponse> {
    return this.alchemy.nft.getFloorPrice(address);
  }
}
