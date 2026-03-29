"use client";

import React from "react";
import Layout from "@/components/layout/Layout";
import LiveLocation from "@/components/LiveLocation";

export default function LocationPage() {
  return (
    <Layout fullWidth noPadding>
      <LiveLocation />
    </Layout>
  );
}
