"use client";

import {useContext} from "react";
import {FirebaseContext} from "@/context/firebase-context";
import {redirect} from "next/navigation";

const ProtectedRoute = ({children, adminOnly}: any) => {
    const {loading, user, isAdmin} = useContext(FirebaseContext);

    if (!user) {
        redirect("/login");
    } else {
        if (adminOnly && !isAdmin) {
            return <div className="w-full h-96 flex justify-center items-center">
                <h1 className="text-2xl">
                    You don't have access to this page.
                </h1>
            </div>
        }
    }

    if (loading) {
        return <div>Loading...</div>
    }

    return <div>{children}</div>;
};

export default ProtectedRoute;
