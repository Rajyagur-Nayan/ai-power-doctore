"use client";

import React from "react";
import Layout from "@/components/layout/Layout";
import dynamic from "next/dynamic";

const LiveLocation = dynamic(() => import("@/components/LiveLocation"), { ssr: false });

export default function LocationPage() {
  return (
    <Layout fullWidth noPadding>
      <LiveLocation />
    </Layout>
  );
}
