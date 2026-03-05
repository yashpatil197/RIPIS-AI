import "../styles/globals.css";
import Navbar from "@/components/Navbar";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="pt-14">
        <Component {...pageProps} />
      </main>
    </>
  );
}
