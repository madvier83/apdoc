import Link from "next/link";
import React, { useEffect, useState } from "react";
import UserDropdown from "../Dropdowns/UserDropdown";
import { useRouter } from "next/router";
import axios from "../../pages/api/axios";
import { getCookie, setCookie } from "cookies-next";
// import veri

export default function Navbar({ title, clinic, setClinic }) {
  const router = useRouter();

  // const [clinics, setClinics] = useState();
  // const [clinicsLoading, setClinicsLoading] = useState();
  // const [apdoc, setApdoc] = useState();

  // if (setClinic) {
  //   const token = getCookie("token");
  //   function parseJwt(token) {
  //     return JSON.parse(
  //       Buffer?.from(token?.split(".")[1], "base64").toString()
  //     );
  //   }

  //   async function getClinics() {
  //     try {
  //       const response = await axios.get(`/clinic/${apdoc.apdoc_id}/apdoc`, {
  //         headers: {
  //           Authorization: "Bearer" + token,
  //         },
  //       });
  //       setClinics(response.data);
  //       setClinicsLoading(false);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }

  //   const initialClinic = "";
  //   // const [clinic, setClinic] = useState("");
  //   const [cookieCheck, setCookieCheck] = useState(false);
  //   useEffect(() => {
  //     try {
  //       let clinicCookie = getCookie("clinic");
  //       setClinic(clinicCookie);
  //       setCookieCheck(true);
  //     } catch (e) {
  //       console.error(e);
  //       setCookie("clinic", "");
  //       setCookieCheck(true);
  //     }
  //   }, []);
  //   useEffect(() => {
  //     if (cookieCheck) {
  //       setCookie("clinic", clinic);
  //     }
  //   }, [clinic]);

  //   useEffect(() => {
  //     setApdoc(parseJwt(token));
  //   }, []);

  //   useEffect(() => {
  //     if (apdoc?.apdoc_id && token) {
  //       getClinics();
  //     }
  //   }, [apdoc]);
  // }

  return (
    <>
      {/* Navbar */}
      <nav className="top-0 left-0 w-full z-10  md:flex-row md:flex-nowrap md:justify-start flex items-center pt-6 pb-4 px-8">
        <div className="w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap">
          {/* Brand */}
          <div className="flex w-full justify-between items-center">
            <div
              className="text-white text-lg uppercase hidden lg:inline-block font-semibold ml-3 mr-8"
              onClick={(e) => e.preventDefault()}
            >
              {title}
            </div>
            {/* <div className="flex items-center mx-auto rounded-md text-slate-200 bg-slate-900 pl-4 py-1">
              <i className="fas fa-hospital"> </i>
              <div className="">
                <select
                  className="p-0 pl-4 pr-0 focus:ring-0 focus:ring-offset-0 ring-transparent bg-transparent border-none rounded-md select- w-48"
                  onChange={(e) => {
                    setClinic(e.target.value);
                  }}
                  value={clinic}
                >
                  {!clinicsLoading &&
                    clinics?.map((obj) => {
                      return (
                        <option
                          key={obj.id}
                          className={"text-black"}
                          value={obj.id}
                        >
                          {obj.name}
                        </option>
                      );
                    })}
                </select>
              </div>
            </div> */}
          </div>
          <div className="flex ml-20">
            <button
              className="text-slate-500 text-lg hidden lg:inline-block font-normal mx-5"
              onClick={() => router.back()}
            >
              <i className="fas fa-arrow-left"></i>
            </button>
          </div>
        </div>
      </nav>
      {/* End Navbar */}
    </>
  );
}
