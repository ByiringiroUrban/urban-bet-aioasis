
import React from "react";
import AdminLayout from "@/components/admin/layout/AdminLayout";
import AdminTabs from "@/components/admin/navigation/AdminTabs";

export default function Admin() {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <AdminTabs />
    </AdminLayout>
  );
}
