interface Flavoring<FlavorT> {
  _type?: FlavorT;
}
export type Flavor<T, FlavorT> = T & Flavoring<FlavorT>;

export type WalletAddress = Flavor<string, "WalletAddress">;
export type ContractAddress = Flavor<string, "ContractAddress">;
export type NftTokenId = Flavor<string, "NftTokenId">;

export type Table<
  R extends string | number | symbol,
  C extends string | number | symbol,
  V,
> = Record<R, Record<C, V>>;
