"use client";

import { createContext, useContext, useMemo } from "react";
import { NftsController, NftsControllerImpl } from "@/app/nfts/nftsController";
import useServices from "@/app/hooks/useServices";

export interface Controllers {
  nftsController: NftsController;
}

const ControllersContext = createContext<Controllers | undefined>(undefined);

export const ControllersProvider = ({
                                   children,
                                 }: {
  children: React.ReactNode;
}) => {
  const {nftsService} = useServices();

  const controllers = useMemo(() => {
    return {
      nftsController: new NftsControllerImpl(nftsService),
    };
  }, [nftsService]);

  return (
    <ControllersContext.Provider value={controllers}>
      {children}
    </ControllersContext.Provider>
  );
};

export default function useControllers(): Controllers {
  const controllers = useContext(ControllersContext);
  if (controllers) {
    return controllers;
  }
  throw Error("Missing ControllersContext.Provider");

}
