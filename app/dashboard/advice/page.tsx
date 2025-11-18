"use client";

import AppNavWrapper from "../../components/AppNavWrapper";
import { PrimaryColorButton } from "../../components/Buttons";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useUserData } from "@/app/context/UserDataProvider";

export default function DashboardPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const leagueId = searchParams.get("leagueId");

    const { userData } = useUserData();

    // validate that user has enough tokens
    useEffect(() => {
        if ((userData?.userInfo.tokens_left ?? 0) <= 0) {
            router.push("/dashboard");
        }

        // Only generate advice if leagueId is present and user has tokens
        const generateAdvice = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/RosterPrediction?leagueId=${leagueId}`);
            } catch (error) {
                console.error(error);
            }
        }

        if (leagueId) {
            generateAdvice();
        }
    }, [userData, leagueId, router]);

    const button = <PrimaryColorButton onClick={() => router.push("/dashboard")}>Back</PrimaryColorButton>;

    return (
        <AppNavWrapper title="AI ROSTER RECOMMENDATIONS" button1={button}>
            This is the roster dashboard...
        </AppNavWrapper>
    );
}