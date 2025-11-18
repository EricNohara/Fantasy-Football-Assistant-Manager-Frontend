"use client";

import AppNavWrapper from "../../components/AppNavWrapper";
import { PrimaryColorButton } from "../../components/Buttons";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useUserData } from "@/app/context/UserDataProvider";
import { createClient } from "@/lib/supabase/client";
import { IAiAdviceResponse } from "@/app/interfaces/IAiAdviceResponse";
import LoadingMessage from "@/app/components/LoadingMessage";
import PlayerList from "@/app/components/PlayerList";
import { ILeagueDefense, IPlayerData } from "@/app/interfaces/IUserData";
import { getCachedAdvice, setCachedAdvice } from "@/lib/utils/cachedAdvice";
import styled from "styled-components";

const StartSitLabel = styled.h2`
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    margin: 1rem;
`

export default function DashboardPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const leagueId = searchParams.get("leagueId");
    const supabase = createClient();

    const { userData } = useUserData();
    const adviceCalledRef = useRef(false); // ensures generateAdvice is called only once

    const [advice, setAdvice] = useState<IAiAdviceResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Validate tokens and redirect if needed
    useEffect(() => {
        if ((userData?.userInfo.tokens_left ?? 0) <= 0) {
            router.push("/dashboard");
        }
    }, [userData, router]);

    // Generate advice only once, after tokens are verified and leagueId is present
    useEffect(() => {
        if (!leagueId || adviceCalledRef.current || !league) return;
        if (!userData || (userData?.userInfo.tokens_left ?? 0) <= 0) return;

        setLoading(true);

        const userId = userData.userInfo.id;
        const playerIds = league.players.map(p => p.player.id);

        // Check cache first
        const cached = getCachedAdvice(userId, leagueId, playerIds);
        if (cached) {
            setAdvice(cached);
            console.log("Loaded AI advice from cache");
            setLoading(false);
            return;
        }

        adviceCalledRef.current = true;

        const generateAdvice = async () => {
            try {
                // get access token
                const { data: sessionData } = await supabase.auth.getSession();
                const accessToken = sessionData?.session?.access_token;
                if (!accessToken) throw new Error("User not authenticated")

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/RosterPrediction?leagueId=${leagueId}`,
                    { headers: { Authorization: `Bearer ${accessToken}` } }
                );

                const json = await res.json();
                const data: IAiAdviceResponse[] = Array.isArray(json.recommendations) ? json.recommendations : [];
                setAdvice(data);

                // cache the result
                setCachedAdvice(userId, leagueId, playerIds, data);

                console.log("AI Advice:", data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        generateAdvice();
    }, [leagueId, userData]);

    const button = <PrimaryColorButton onClick={() => router.push("/dashboard")}>Back</PrimaryColorButton>;

    // get current league
    const league = userData?.leagues.find(l => l.leagueId === leagueId);

    // Step 1: Collect all playerIds picked in ANY position
    const pickedPlayerIds = new Set(advice.filter(a => a.picked).map(a => a.playerId));

    // Step 2: Start players: any player in pickedPlayerIds
    const startPlayers: IPlayerData[] = league?.players
        .filter(p => pickedPlayerIds.has(p.player.id))
        .map(p => ({ ...p, picked: true })) ?? [];

    // Step 3: Sit players: all players NOT in pickedPlayerIds
    const sitPlayers: IPlayerData[] = league?.players
        .filter(p => !pickedPlayerIds.has(p.player.id))
        .map(p => ({ ...p, picked: false })) ?? [];

    // Step 4: Same for defenses
    const pickedDefIds = new Set(advice.filter(a => a.picked && a.position === "DEF").map(a => a.playerId));

    const startDefs: ILeagueDefense[] = league?.defenses
        .filter(d => pickedDefIds.has(d.team.id))
        .map(d => ({ ...d, picked: true })) ?? [];

    const sitDefs: ILeagueDefense[] = league?.defenses
        .filter(d => !pickedDefIds.has(d.team.id))
        .map(d => ({ ...d, picked: false })) ?? [];

    return (
        <AppNavWrapper title="AI ROSTER RECOMMENDATIONS" button1={button}>
            {loading && <LoadingMessage message="Loading AI roster recommendations..." />}

            {!loading && advice.length > 0 && (
                <>
                    <StartSitLabel>STARTERS</StartSitLabel>
                    <PlayerList players={startPlayers} defenses={startDefs} />

                    <StartSitLabel>BENCH</StartSitLabel>
                    <PlayerList players={sitPlayers} defenses={sitDefs} />
                </>
            )}

            {!loading && advice.length === 0 && <p>No advice available yet.</p>}
        </AppNavWrapper>
    );
}
