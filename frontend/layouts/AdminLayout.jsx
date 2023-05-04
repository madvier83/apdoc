import React from "react";

// components

import AdminNavbar from "../components/Navbars/AdminNavbar";
import AdminSidebar from "../components/Sidebar/AdminSidebar";
import AdminStats from "../components/Headers/AdminStats";
import FooterAdmin from "../components/Footers/FooterAdmin";
import Head from "next/head";

export default function AdminLayout({ title, children, headerStats }) {
    return (
        <>
        <Head>
            <title>{`APDOC | ${title || ""}`}</title>
        </Head>
        <AdminSidebar />
        <div className="relative md:ml-64 bg-gray-900 min-h-screen">
            <AdminNavbar title={title} />
            {/* Header */}
            <AdminStats headerStats={headerStats}/>
            <div className="px-4 md:px-10 mx-auto w-full -m-24">
            {children}
            {/* <FooterAdmin /> */}
            </div>
        </div>
        </>
    );
}