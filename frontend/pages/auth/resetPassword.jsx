import React, { useState, useEffect } from "react";
import AuthLayout from "../../layouts/AuthLayout";
import Link from "next/link";

export default function ResetPassword() {
  return (
    <>
      <AuthLayout title={"APDOC | Change Password"}>
        <div className="container mx-auto px-4 h-[60vh]">
          <div className="flex content-center items-center justify-center h-full">
            <div className="w-full lg:w-4/12 px-4">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 -lg rounded-lg border-0">
                <div className="rounded-t mb-0 px-6 py-6">
                  <div className="text-center mb-3">
                    <h6 className="fredoka text-white text-4xl mt-4 font-bold">
                      APDOC
                    </h6>
                  </div>
                </div>
                <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                  <div
                    className="cursor-progress mx-autos text-white text-sm text-center"
                    type="button"
                    disabled
                  >
                    Cek email anda,
                    <Link href={"/auth/login"}>
                      <span className="text-emerald-200"> kembali ke halaman login</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
