"use client";

import React from "react";

import RoleForm from "@/components/roles/role-form";

export default function RolePage({ params }: any) {
  return (
    <div className="w-full h-full flex justify-center">
      <RoleForm roleId={params.id} />
    </div>
  );
}
