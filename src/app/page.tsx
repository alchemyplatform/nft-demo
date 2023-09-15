import dynamic from "next/dynamic";

const Nfts = dynamic(() => import('@/app/nfts/Nfts'), {ssr: false});

export default function Home() {
  return <Nfts/>;
}
