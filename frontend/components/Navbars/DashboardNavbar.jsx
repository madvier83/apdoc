import Link from "next/link";
import React, { useEffect, useState } from "react";
import UserDropdown from "../Dropdowns/UserDropdown";
import { useRouter } from "next/router";
import axios from "../../pages/api/axios";
import { getCookie, setCookie } from "cookies-next";
import Script from "next/script";
// import veri

export default function Navbar({ title, clinic, setClinic }) {
  const router = useRouter();

  const [clinics, setClinics] = useState();
  const [clinicsLoading, setClinicsLoading] = useState();

  const token = getCookie("token");
  function parseJwt(token) {
    return JSON.parse(Buffer?.from(token?.split(".")[1], "base64").toString());
  }
  const [apdoc, setApdoc] = useState();

  async function getClinics() {
    if (!apdoc) {
      return;
    }
    setClinicsLoading(true);
    try {
      const response = await axios.get(`/clinic/${apdoc.apdoc_id}/apdoc`, {
        headers: {
          Authorization: "Bearer" + token,
        },
      });
      setClinics(response.data);
      setClinicsLoading(false);

      let clinicCookie = getCookie("clinic");
      // console.log(clinicCookie)
      if (!clinicCookie) {
        setClinic(response.data[0]?.id);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // const initialClinic = "";
  // const [clinic, setClinic] = useState("");
  const [cookieCheck, setCookieCheck] = useState(false);

  if (setClinic) {
    useEffect(() => {
      try {
        let clinicCookie = getCookie("clinic");
        setClinic(clinicCookie);
        setCookieCheck(true);
      } catch (e) {
        console.error(e);
        setCookie("clinic", "");
        setCookieCheck(true);
      }
    }, []);
    useEffect(() => {
      let clinicCookie = getCookie("clinic");
      if (clinicCookie == "" && clinics) {
        setCookie("clinic", clinics[0].id);
      }
    }, [router.isReady]);

    useEffect(() => {
      if (cookieCheck) {
        setCookie("clinic", clinic);
      }
    }, [clinic]);

    useEffect(() => {
      if (apdoc?.role_id > 2) {
        setClinic(apdoc?.clinic_id);
      }
      if (apdoc?.apdoc_id && token) {
        getClinics();
      }
    }, [apdoc]);

    useEffect(() => {
      setApdoc(parseJwt(token));
    }, []);

    // console.log(clinic);
  }

  return (
    <>
      {/* Navbar */}
      <nav className="top-0 left-0 w-full z-10  md:flex-row md:flex-nowrap md:justify-start flex items-center pt-6 pb-4 px-8">
        <div className="w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap">
          {/* Brand */}
          <div
            className={`grid grid-flow-col w-full justify-between items-center`}
          >
            <Link
              className="text-white text-lg uppercase hidden lg:inline-block font-semibold w-96 ml-3"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              {title}
            </Link>
            <div className="">
              {setClinic && (
                <div
                  className={`${
                    apdoc?.role_id == 2 ? "block" : "hidden"
                  } flex items-center mx-auto rounded-md text-slate-200 bg-opacity-10 bg-emerald-500 pl-4 py-1`}
                >
                  <i className="fas fa-house-chimney-medical ml-1 text-emerald-400">
                    {" "}
                  </i>
                  <div className="">
                    <select
                      className="p-0 pl-0 pr-8 tracking-wider appearance-none text-emerald-400 text-center focus:ring-0 focus:ring-offset-0 ring-transparent bg-transparent border-none rounded-md w-48"
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
                              className={`${
                                obj.status != "active"
                                  ? "text-rose-400 text-opacity-50"
                                  : "text-black"
                              } `}
                              value={obj.id}
                              disabled={obj.status != "active"}
                            >
                              {obj.status != "active" && "🔒"} {obj.name}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                </div>
              )}
            </div>
            <div className="w-96 flex justify-end pr-8">
              <button
                className="text-slate-500 text-lg hidden lg:inline-block font-normal mx-5"
                onClick={() => router.back()}
              >
                <i className="fas fa-arrow-left"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* End Navbar */}
    </>
  );
}
