import * as _ from "lodash";
import { BigNumber, OpenSeaCollectionMetadata, OwnedNft } from "alchemy-sdk";
import { NftsService } from "@/app/nfts/nftsService";
import { ContractAddress, Flavor, NftTokenId, WalletAddress, } from "@/app/types";

export type NftId = Flavor<string, "WalletAddress">;

export interface Attribute {
  traitType: string;
  value: string;
}

export interface NftEntry {
  id: NftId;
  collectionName: string;
  name: string;
  imageUrl?: string;
  isSpam: boolean;
  contractName?: string;
  attributes: Attribute[];
  openSeaCollectionMetadata?: OpenSeaCollectionMetadata;
}

export interface NftStats {
  rarity?: number;
  floorPrice?: number;
}

export interface NftsResponse {
  rawResponse: OwnedNft[];
  nfts: NftEntry[];
}

export interface NftsController {
  getNfts(address: WalletAddress): Promise<NftsResponse>;

  getStats(id: NftId): Promise<NftStats>;
}

export class NftsControllerImpl implements NftsController {
  constructor(private readonly nftsService: NftsService) {
  }

  public async getNfts(address: WalletAddress): Promise<NftsResponse> {
    const nfts = await this.nftsService.getOwnerNfts(address);

    // NFT can be anything so we will only show a subset of all possibilities
    const acceptedFormats = new Set(["png", "jpeg", "svg"]);

    function isAcceptedFormat(format: string): boolean {
      return acceptedFormats.has(format) && !format.includes("svg+xml");
    }

    const processedNfts =
      nfts
        .filter((nft) => isAcceptedFormat(nft.media[0]?.format || "png"))
        .map((nft) => {
          const id = this.getIdFromAddressAndTokenId(
            nft.contract.address,
            nft.tokenId,
          );

          const attributes = (
            nft.rawMetadata?.attributes || []
          ).map((record) => {
            return {
              traitType: record.trait_type as string,
              value: record.value as string,
            };
          });

          return {
            id,
            imageUrl: nft.media[0]?.gateway,
            name: nft.title,
            collectionName:
              nft.contract.openSea?.collectionName ||
              nft.title.replace(/#.*$/g, " "),
            isSpam: nft.spamInfo?.isSpam ?? false,
            contractName: nft.contract.name,
            attributes,
            openSeaCollectionMetadata: nft.contract.openSea,
          };
        });

    return {
      rawResponse: nfts,
      nfts: processedNfts,
    }
  }

  public async getStats(id: NftId): Promise<NftStats> {
    const {address, tokenId} = this.getAddressAndTokenIdFromId(id);
    const [rarityResponse, floorPriceResponse] = await Promise.all([
      this.nftsService.getRarity(address, tokenId),
      this.nftsService.getFloorPrice(address),
    ]);

    const minFloorPrice = _.chain([
      floorPriceResponse.openSea,
      floorPriceResponse.looksRare,
    ])
      .map((response) => {
        return response as { floorPrice?: number };
      })
      .filter((x) => !_.isNil(x))
      .minBy((x) => x.floorPrice)
      .value();

    // Simple average of all rarity scores
    const rarity = rarityResponse.length
      ? rarityResponse
      .map((r) => r.prevalence)
      .reduce((acc, value) => acc + value, 0) / rarityResponse.length
      : undefined;

    return {
      rarity,
      floorPrice: minFloorPrice?.floorPrice,
    };
  }

  private getIdFromAddressAndTokenId(
    address: ContractAddress,
    tokenId: NftTokenId,
  ): NftId {
    return `${address}-${BigNumber.from(tokenId).toString()}`;
  }

  private getAddressAndTokenIdFromId(id: NftId): {
    address: ContractAddress;
    tokenId: NftTokenId;
  } {
    const [address, tokenId] = id.split("-");

    return {
      address: address as ContractAddress,
      tokenId: BigNumber.from(tokenId).toString() as NftTokenId,
    };
  }
}
