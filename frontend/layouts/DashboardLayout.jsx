import React from "react";

// components

import AdminNavbar from "../components/Navbars/AdminNavbar";
import Sidebar from "../components/Sidebar/Sidebar";
import HeaderStats from "../components/Headers/HeaderStats";
import FooterAdmin from "../components/Footers/FooterAdmin";
import Head from "next/head";

export default function DashboardLayout({ title, children, headerStats }) {
    return (
        <>
        <Head>
            <title>{`APDOC | ${title || ""}`}</title>
        </Head>
        <Sidebar />
        <div className="relative md:ml-64 bg-slate-800 min-h-screen">
            <AdminNavbar title={title} />
            {/* Header */}
            <HeaderStats headerStats={headerStats}/>
            <div className="px-4 md:px-10 mx-auto w-full -m-24 overflow-hidden">
                {children}
                {/* <FooterAdmin /> */}
            </div>
        </div>
        </>
    );
}

