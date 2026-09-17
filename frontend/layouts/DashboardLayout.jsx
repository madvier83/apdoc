import React, { useEffect } from "react";

// components

import DashboardNavbar from "../components/Navbars/DashboardNavbar"
import Sidebar from "../components/Sidebar/Sidebar";
import HeaderStats from "../components/Headers/HeaderStats";
import FooterAdmin from "../components/Footers/FooterAdmin";
import Head from "next/head";
import Script from "next/script";

export default function DashboardLayout({ title, children, headerStats, clinic, setClinic, hideSidebar = false }) {
    return (
        <>
            <Head>
                <title>{`APDOC | ${title || ""}`}</title>
            </Head>
            {!hideSidebar &&
                <Sidebar />
            }
            <div className={`relative min-h-screen bg-gray-800 transition-all duration-500 ease-in-out ${hideSidebar ? 'md:ml-0' : 'md:ml-64'}`}>                <DashboardNavbar title={title} clinic={clinic} setClinic={setClinic} />
                {/* Header */}
                <HeaderStats headerStats={headerStats} />
                <div className="px-4 md:px-10 mx-auto w-full -m-24">
                    {children}
                    {/* <FooterAdmin /> */}
                </div>
            </div>
        </>
    );
}

