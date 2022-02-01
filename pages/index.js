import Underwater from "../components/Underwater";
import shareImage from "../images/og_share.jpg";
import Head from "next/head";

const getAbsoluteUrl = (path) => {
  if (process.env.NEXT_PUBLIC_DOMAIN) {
    return `${process.env.NEXT_PUBLIC_DOMAIN}${path}`;
  } else {
    throw new Error("Must provide an absolute url NEXT_PUBLIC_DOMAIN");
  }
};

export default function Home() {
  return (
    <div className="font-Salty text-5xl text-blue-500">
      <Head>
        <title>PLX Tjärö 2022 på Tjärö i Blekinge skärgård.</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:title" content="~~ PLX TJÄRÖ 2022 ~~" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={getAbsoluteUrl("")} />
        <meta property="og:image" content={getAbsoluteUrl(shareImage.src)} />
        <meta property="og:image:width" content={shareImage.width} />
        <meta property="og:image:height" content={shareImage.height} />
      </Head>
      <Underwater />
    </div>
  );
}
