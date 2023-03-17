import gsap from "gsap";
import React, { useEffect, useRef } from "react";

// components

import CardStats from "../Cards/CardStats";

export default function HeaderStats({ headerStats }) {

  return (
    <>
      {/* Header */}
      <div className="relative h-20">
        {/* {headerStats && (
          <div className="px-2 md:px-8 mx-auto w-full">
            <div>
              <div className="flex flex-wrap">
                <div className="w-full lg:w-6/12 xl:w-3/12 px-2">
                  <CardStats
                    statSubtitle="Gross Sales"
                    statTitle="350,897"
                    // statArrow="up"
                    // statPercent="3.48"
                    // statPercentColor="text-emerald-500"
                    // statDescripiron="Since last month"
                    statIconName="far fa-chart-bar"
                    statIconColor="bg-red-500"
                  />
                </div>
                <div className="w-full lg:w-6/12 xl:w-3/12 px-2 pt-0">
                  <CardStats
                    statSubtitle="Net Sales"
                    statTitle="2,356"
                    // statArrow="down"
                    // statPercent="3.48"
                    // statPercentColor="text-red-500"
                    // statDescripiron="Since last week"
                    statIconName="fas fa-chart-pie"
                    statIconColor="bg-orange-500"
                  />
                </div>
                <div className="w-full lg:w-6/12 xl:w-3/12 px-2 pt-0">
                  <CardStats
                    statSubtitle="Transaction"
                    statTitle="924"
                    // statArrow="down"
                    // statPercent="1.10"
                    // statPercentColor="text-orange-500"
                    // statDescripiron="Since yesterday"
                    statIconName="fas fa-dollar"
                    statIconColor="bg-pink-500"
                  />
                </div>
                <div className="w-full lg:w-6/12 xl:w-3/12 px-2 pt-0">
                  <CardStats
                    statSubtitle="Average Sale"
                    statTitle="49,65%"
                    // statArrow="up"
                    // statPercent="12"
                    // statPercentColor="text-emerald-500"
                    // statDescripiron="Since last month"
                    statIconName="fas fa-percent"
                    statIconColor="bg-lightBlue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </>
  );
}
