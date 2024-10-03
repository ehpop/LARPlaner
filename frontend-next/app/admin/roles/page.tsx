"use client";

import RolesDisplay from "@/components/roles/roles-display";

const roles = [
  "mag",
  "wojownik",
  "złodziej",
  "czarodziej",
  "kapłan",
  "łucznik",
  "tancerz ostrzy",
  "druid",
  "bard",
  "szaman"
];

export default function RolesPage() {
  return (
    <div className="w-full space-y-3">
      <div className="w-full flex justify-center">
        <p className="text-3xl">Roles Page</p>
      </div>
      <RolesDisplay canAddNewRole={true} rolesList={roles} title={"Rola"} />
    </div>
  );
}
