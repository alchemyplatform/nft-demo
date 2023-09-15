Alchemy API Demo

This demo app show-case Alchemy's [NFT APIs](https://docs.alchemy.com/reference/nft-api-quickstart). Feel free to fork this repo or play around with it with [Replit](https://replit.com/@alchemyplatform/nft-demo).

[nftsServices.ts](./src/app/nfts/nftsService.ts) uses our [Alchemy SDK](https://www.npmjs.com/package/alchemy-sdk).
[nftsController.ts](./src/app/nfts/nftsController.ts) uses nftsServices.ts and transform the raw data to the format our view needs.
[Nfts.tsx](./src/app/nfts/Nfts.tsx) contains the React components to render our views.

## Getting Started

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

