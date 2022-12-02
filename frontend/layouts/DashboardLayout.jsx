import React from "react";

// components

import AdminNavbar from "../components/Navbars/AdminNavbar";
import Sidebar from "../components/Sidebar/Sidebar";
import HeaderStats from "../components/Headers/HeaderStats";
import FooterAdmin from "../components/Footers/FooterAdmin";
import Head from "next/head";

export default function DashboardLayout({ title, children }) {
    return (
        <>
        <Head>
            <title>APPDOC | {title}</title>
        </Head>
        <Sidebar />
        <div className="relative md:ml-64 bg-blueGray-100">
            <AdminNavbar title={title} />
            {/* Header */}
            <HeaderStats />
            <div className="px-4 md:px-10 mx-auto w-full -m-24">
            {children}
            <FooterAdmin />
            </div>
        </div>
        </>
    );
}
