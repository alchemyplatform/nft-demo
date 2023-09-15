"use client";

import { createContext, useContext, useMemo } from "react";
import { NftsService, NftsServiceImpl } from "@/app/nfts/nftsService";
import { useAlchemy } from "@/app/hooks/useAlchemy";

export interface Services {
  nftsService: NftsService;
}

const ServicesContext = createContext<Services | undefined>(undefined);

export const ServicesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const alchemy = useAlchemy();

  const services = useMemo(() => {
    return {
      nftsService: new NftsServiceImpl(alchemy),
    };
  }, [alchemy]);

  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
};

export default function useServices(): Services {
  const services = useContext(ServicesContext);
  if (services) {
    return services;
  }
  throw Error("Missing ServicesContext.Provider");
}
