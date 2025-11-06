"use client";

import AppNavWrapper from "../components/AppNavWrapper";
import { PrimaryColorButton } from "../components/Buttons";
import { useRouter } from "next/navigation";

export default function ArticlesPage() {
    const router = useRouter();
    const button = <PrimaryColorButton onClick={() => router.push("/settings")}>Set Up Auto Send</PrimaryColorButton>;

    return (
        <AppNavWrapper title="ARTICLES" button1={button}>
            This is the articles page...
        </AppNavWrapper>
    )
}