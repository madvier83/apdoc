import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "./api/axios";

import AuthLayout from "../layouts/AuthLayout";

export default function Login() {
    var router = useRouter();
    const [email, setEmail] = useState()

    async function verifyEmail(thisEmail) {
        try {
            const response = await axios.get(
                "/auth/email/verification?email=" + thisEmail
            );
            console.log(response);
        } catch (err) {
            console.error(err);
        }
    }
    useEffect(()=>{
        if(!router.isReady) return;
        setEmail(router.query.email)
        verifyEmail(router.query.email)
    }, [router.isReady]);
    
    return (
        <>
        <AuthLayout title={"APDOC | Verified"}>
            <div className=" container mx-auto px-4 h-[60vh]">
            <div className="z-50 flex content-center flex-col items-center justify-center h-full">
                <h1 className="text-white text-3xl font-bold mb-8 text-center">
                Email sudah diverifikasi <i className="fas fa-check"></i>
                <p className="font-normal text-zinc-400 text-lg">({email})</p>
                </h1>
                <button
                className="z-50 w-80 bg-emerald-600 text-white active:bg-emerald-700 text-sm font-bold px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                onClick={() => router.push("/dashboard/account")}
                >
                Konfirmasi
                </button>
            </div>
            </div>
        </AuthLayout>
        </>
    );
}
