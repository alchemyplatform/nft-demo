"use client";

import { Alchemy, Network } from "alchemy-sdk";
import { createContext, useContext, useMemo } from "react";

const AlchemyContext = createContext<Alchemy | null>(null);

export const AlchemyProvider = ({
                                  children,
                                }: {
  children: React.ReactNode;
}) => {
  const alchemy = useMemo(() => {
    const settings = {
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
      network: Network.ETH_MAINNET,
    };
    return new Alchemy(settings);
  }, []);

  return (
    <AlchemyContext.Provider value={alchemy}>
      {children}
    </AlchemyContext.Provider>
  );
};

export function useAlchemy(): Alchemy {
  const alchemy = useContext(AlchemyContext);

  if (alchemy === null) {
    throw new Error("Alchemy is not configured");
  }

  return alchemy;
}
