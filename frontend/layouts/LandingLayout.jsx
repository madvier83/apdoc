import React, { useState } from "react";

// components

import Head from "next/head"
import Navbar from "../components/Navbars/AuthNavbar";
import Footer from "../components/Footers/Footer";

export default function LandingLayout({children}) {
    return (
        <>
            <Head>
                <title>APDOC | Clinic System</title>
            </Head>

            <Navbar transparent />
                <main>
                    {children}
                </main>
            <Footer />
        </>
    );
}
