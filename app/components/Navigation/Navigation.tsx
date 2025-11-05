"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthProvider";
import AppNav from "./AppNav";
import LandingNav from "./LandingNav";


export default function Navigation() {
    const pathname = usePathname();
    const { isLoggedIn } = useAuth();

    const isLanding = pathname === "/";

    if (isLanding) return <LandingNav />;
    else if (isLoggedIn) return <AppNav />;
    else return null;
}
