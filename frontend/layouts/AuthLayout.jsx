import React from "react";

// components

import Navbar from "../components/Navbars/AuthNavbar";
import FooterSmall from "../components/Footers/FooterSmall";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Auth({ children, title, isAdmin }) {
  const route = useRouter()
  console.log(route.pathname)
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {/* <Navbar transparent /> */}
      <main>
        <section className={`relative w-full h-full py-40 min-h-screen bg-zinc-900`}>
          <div
            className={`absolute top-0 -z-0 w-full h-full bg-no-repeat bg-full hidden md:block ${route.pathname == "/auth/admin" && "grayscale"}`}
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
