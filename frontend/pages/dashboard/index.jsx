import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";

export default function Dashboard() {
  return (
    <>
      <DashboardLayout title="Dashboard">

      </DashboardLayout>
    </>
  );
}
