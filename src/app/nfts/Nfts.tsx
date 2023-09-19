"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from 'next/image'
import { NftEntry } from "@/app/nfts/nftsController";
import LoadSpinner from "@/app/components/LoadSpinner";
import useControllers from "@/app/hooks/useControllers";
import { Button, Label, Sidebar, TextInput } from "flowbite-react";
import { OwnedNft } from "alchemy-sdk";
import ReactJson from "react-json-view";
import { resourceUrl } from "@/app/utils/utils";

export default function Nfts() {
  const [address, setAddress] = useState('0xF5FFF32CF83A1A614e15F25Ce55B0c0A6b5F8F2c')
  const [loading, setLoading] = useState(true)
  const [showSpam, setShowSpam] = useState(false);
  const [nfts, setNfts] = useState<NftEntry[]>([]);
  const [rawResponse, setRawResponse] = useState<OwnedNft[]>([]);

  const {nftsController} = useControllers();

  const nftsToShow = nfts.filter(
    (nft) => nft.imageUrl && (!nft.isSpam || showSpam),
  );

  useEffect(() => {
    fetchNfts()
  }, []);

  async function fetchNfts() {
    if (address) {
      setLoading(true);
      setNfts([]);

      const refreshNfts = async () => {
        const {rawResponse, nfts} = await nftsController.getNfts(address);
        setNfts(nfts);
        setRawResponse(rawResponse);
      };

      refreshNfts()
        .catch((err) => console.error(err))
        .finally(() => {
          setLoading(false);
        });
    } else {
      setNfts([]);
      setLoading(false);
    }
  }

  const mainContent = useMemo(() => {
    if (loading) {
      return <LoadSpinner/>;
    }

    return <>
      <div className="flex flex-col w-1/2 gap-4 h-full">
        <NftsHeader
          nfts={nfts}
          showSpam={showSpam}
          toggleSpam={() =>
            setShowSpam((currentShowSpam) => {
              return !currentShowSpam;
            })
          }
        />
        <NftsContainer nfts={nftsToShow}/>
      </div>

      <div className="flex w-1/2 h-full">
        <DevSidebar rawResponse={rawResponse}/>
      </div>
    </>
  }, [loading, nfts, rawResponse, showSpam])

  return (
    <>
      <header className="mt-4">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-2xl">
          <a className="flex items-center" href={"https://www.alchemy.com"}><Image src={resourceUrl("/alchemy.svg")} height={36} width={168} alt={"Alchemy Logo"}/></a>
          <div className="justify-between items-center w-full lg:flex lg:w-auto lg-order-1"><a href={"https://codespaces.new/alchemyplatform/nft-demo?quickstart=1"}><Image src={"https://github.com/codespaces/badge.svg"} height={32} width={249} alt={"Open in GitHub Codespaces"}/></a></div>
        </div>
      </header>

      <div className="p-4 flex flex-col justify-center gap-4">
        <NftsAddressForm address={address} setAddress={setAddress} loading={loading} onSubmit={fetchNfts}/>

        <div className="flex flex-row gap-4 h-screen">
          {mainContent}
        </div>
      </div>
    </>
  )
}

interface DevSidebarProps {
  rawResponse: OwnedNft[];
}

function DevSidebar({rawResponse}: DevSidebarProps) {
  return (<Sidebar className="w-full">
    <ReactJson src={rawResponse} collapsed={2} theme="monokai" name={false} enableClipboard={true}
               displayDataTypes={true} collapseStringsAfterLength={20}/>
  </Sidebar>)
}

interface NftsAddressFormProps {
  address: string;
  loading: boolean;
  setAddress: (address: string) => void;
  onSubmit: () => void;
}

function NftsAddressForm({address, setAddress, loading, onSubmit}: NftsAddressFormProps) {
  return (<div className="flex justify-center items-center">
    <form className="flex gap-4">
      <div className="flex items-center">
        <div className="block">
          <Label
            htmlFor="address"
            value="Address"
          />
        </div>
        <div>
          <TextInput
            id="address"
            className="w-96 ml-4"
            placeholder="Wallet Address"
            sizing="sm"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <Button className="ml-4" type="submit" disabled={loading} onClick={(e) => {
          e.preventDefault()
          onSubmit();
        }}>
          Fetch NFTs
        </Button>
      </div>
    </form>
  </div>);
}

interface NftsHeaderProps {
  nfts: NftEntry[];
  showSpam: boolean;
  toggleSpam: () => void;
}

function NftsHeader({
                      nfts,
                      showSpam,
                      toggleSpam,
                    }: NftsHeaderProps) {
  const spamCount = nfts.filter((nft) => nft.isSpam).length;

  return (
    <div className="flex items-center justify-between">
      <div>
        NFTs {nfts.length ? `(${nfts.length})` : ""}
      </div>
      <div className="flex flex-col">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={toggleSpam}
        >
          {showSpam ? (
            <Image src={resourceUrl("/see.svg")} width={24} height={24} alt={"Show spam"}/>
          ) : (
            <Image
              src={resourceUrl("/ph_eye-bold.svg")}
              width={24}
              height={24}
              alt={"Hide spam"}
            />
          )}
          <span>Spam {spamCount ? `(${spamCount})` : ""}</span>
        </div>
      </div>
    </div>
  );
}

interface NftsContainerProps {
  nfts: NftEntry[];
}

function NftsContainer({nfts}: NftsContainerProps) {
  return (<div className="h-full">
    <div className="grid grid-cols-auto-fill-200px gap-4 overflow-y-auto h-full">
      {nfts.map((nft) => {
        return <NftItem nftItem={nft} key={nft.id}/>;
      })}
    </div>
  </div>)
}

interface NftItemProps {
  nftItem: NftEntry;
}

function NftItem({nftItem}: NftItemProps) {
  return (
    <div className="flex border-2 w-[200px] flex-col rounded-lg" key={nftItem.id}>
      <div>
        <img className="w-[200px] h-[200px]" src={nftItem.imageUrl}/>
      </div>
      <div className="flex">
        <span className="text-xs font-extralight text-gray-600 truncate hover:overflow-visible">
          {nftItem.collectionName}
        </span>
      </div>
      <div className="text-base font-bold truncate hover:overflow-visible">{nftItem.name}</div>
    </div>
  );
}
