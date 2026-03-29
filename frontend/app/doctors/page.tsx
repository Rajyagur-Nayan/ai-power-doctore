"use client";

import React from "react";
import Layout from "@/components/layout/Layout";
import DoctorList from "@/components/DoctorList";

export default function DoctorsPage() {
  return (
    <Layout>
      <div className="py-8 px-4 flex flex-col items-center">
        <div className="w-full max-w-5xl mb-8">
          <h2 className="text-3xl font-bold text-healthcare-900 mb-2">Our Doctors</h2>
          <p className="text-healthcare-500 font-medium">Find and connect with healthcare professionals in your area.</p>
        </div>
        
        <DoctorList />
      </div>
    </Layout>
  );
}
