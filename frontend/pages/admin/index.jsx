import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import AdminLayout from "../../layouts/AdminLayout";

export default function Admin() {
  return (
    <>
      <AdminLayout title="Dashboard" headerStats={true}>

      </AdminLayout>
    </>
  );
}
