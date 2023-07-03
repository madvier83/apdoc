import React from "react";

// components

import Navbar from "../components/Navbars/AuthNavbar";
import FooterSmall from "../components/Footers/FooterSmall";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Auth({ children, title, isAdmin }) {
  const route = useRouter();
  // console.log(route.pathname)
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main className="h-screen">
        <div className="bg-zinc-900 min-h-screen">
          <div className="-z-50">
            <img
              src="/img/register_bg_2.png"
              alt="Hi"
              className={`absolute top-0 w-full hidden md:block`}
            />
          </div>
          <div className="z-50 py-24">{children}</div>
        </div>
      </main>
    </>
  );
}
