import React from "react";

// components

import Navbar from "../components/Navbars/AuthNavbar";
import FooterSmall from "../components/Footers/FooterSmall";
import Head from "next/head";

export default function Auth({ children, title }) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {/* <Navbar transparent /> */}
      <main>
        <section className="relative w-full h-full py-40 min-h-screen bg-blueGray-800">
          <div
            className="absolute top-0 w-full h-full bg-no-repeat bg-full hidden md:block"
            // /login.svg
            style={{
              backgroundImage: "url('/img/register_bg_2.png')",
              backgroundSize: "cover",
            }}
          ></div>
          {children}
          {/* <FooterSmall absolute /> */}
        </section>
      </main>
    </>
  );
}
