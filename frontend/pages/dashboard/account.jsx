import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";

import PersonalDetails from "../../components/Forms/PersonalDetails";
import CardProfile from "../../components/Cards/CardProfile"
import BusinessInformation from "../../components/Forms/BusinessInformation";
import CardBusiness from "../../components/Cards/CardBusiness";

export default function Account() {
  return (
    <>
      <DashboardLayout title="Account" headerStats={false}>
      <div className="flex flex-wrap">
        <div className="w-full lg:w-8/12 px-4">
          <PersonalDetails />
          <BusinessInformation />
        </div>
        <div className="w-full lg:w-4/12 px-4">
          <CardProfile />
          <CardBusiness />
        </div>
      </div>
      </DashboardLayout>
    </>
  );
}
