"use client";

import AppNavWrapper from "../components/AppNavWrapper";
import { PrimaryColorButton } from "../components/Buttons";
import { useRouter } from "next/navigation";
import { useUserData } from "../context/UserDataProvider";
import { useEffect, useState } from "react";
import { ILeagueData, ILeagueDefense, IPlayerData } from "../interfaces/IUserData";
import styled from "styled-components";
import PlayerList from "../components/PlayerList";
import PlayerStatsOverlay from "../components/Overlay/PlayerStatsOverlay";
import Overlay from "../components/Overlay/Overlay";
import DefenseStatsOverlay from "../components/Overlay/DefenseStatsOverlay";
import { createClient } from "@/lib/supabase/client";

const LeagueDropdown = styled.select`
  padding: 0.5rem 1rem;
  border-radius: var(--global-border-radius);
  background-color: var(--color-base-dark-4);
  color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s ease, background-color 0.2s ease;

  option {
    background-color: var(--color-base-dark-3);
    color: white;
  }
`;

const NoDataMessage = styled.p`
    font-style: italic;
    color: var(--color-txt-3);
`;

export default function DashboardPage() {
    const router = useRouter();
    const { userData, refreshUserData } = useUserData();
    const [selectedLeagueData, setSelectedLeagueData] = useState<ILeagueData | null>(null);
    const [showOverlay, setShowOverlay] = useState<boolean>(false);
    const [selectedPlayer, setSelectedPlayer] = useState<IPlayerData | null>(null);
    const [selectedDefense, setSelectedDefense] = useState<ILeagueDefense | null>(null);
    const supabase = createClient();

    // Set default selected league on load (first one)
    useEffect(() => {
        if (userData?.leagues && userData.leagues.length > 0) {
            setSelectedLeagueData(userData.leagues[0]);
        }
    }, [userData]);

    const handleLeagueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const leagueId = e.target.value;
        const league = userData?.leagues.find(l => l.leagueId === leagueId) ?? null;
        setSelectedLeagueData(league);
    };

    const handleClickAdvice = () => {
        const tokensRemaining = userData?.userInfo.tokens_left ?? 0;
        const name = userData?.userInfo.fullname ? userData?.userInfo.fullname : "";

        if (tokensRemaining <= 0) {
            alert(`User ${name} has ${tokensRemaining} tokens remaining. Purchase more tokens to continue.`);
            return;
        }

        alert(`User ${name}, would you like to spend one token to generate ai advice? Operation cannot be reversed. You will have ${tokensRemaining - 1} tokens remaining after this operation.`)

        router.push(`/dashboard/advice?leagueId=${selectedLeagueData?.leagueId}`)
    }

    const editButton = <PrimaryColorButton onClick={() => router.push(`/stats?leagueId=${selectedLeagueData?.leagueId}`)}>Edit Roster</PrimaryColorButton>;
    const adviceButton = <PrimaryColorButton onClick={handleClickAdvice}>Generate Advice</PrimaryColorButton>;

    // Secondary "button" as dropdown
    const leagueDropdown = (
        <LeagueDropdown value={selectedLeagueData?.leagueId ?? ""} onChange={handleLeagueChange}>
            {userData?.leagues.map(league => (
                <option key={league.leagueId} value={league.leagueId}>
                    {league.leagueName}
                </option>
            ))}
        </LeagueDropdown>
    );

    const onPlayerClick = (player: IPlayerData) => {
        setShowOverlay(true);
        setSelectedDefense(null);
        setSelectedPlayer(player);
    }

    const onDefenseClick = (defense: ILeagueDefense) => {
        setShowOverlay(true);
        setSelectedPlayer(null);
        setSelectedDefense(defense);
    }

    const onPlayerDelete = async (player: IPlayerData) => {
        try {
            const { data: sessionData } = await supabase.auth.getSession();
            const accessToken = sessionData?.session?.access_token;
            if (!accessToken) throw new Error("User not authenticated");

            // construct payload for player/defense updates
            const payload = {
                leagueId: selectedLeagueData?.leagueId,
                memberId: player?.player.id,
                isDefense: false
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/UpdateUserLeague/member`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

            if (!res.ok) throw new Error();

            refreshUserData();
            setShowOverlay(false);
        } catch (e) {
            alert("Failed to delete player from your league's roster");
            console.error(e);
        }
    }

    const onDefenseDelete = async (defense: ILeagueDefense) => {
        try {
            const { data: sessionData } = await supabase.auth.getSession();
            const accessToken = sessionData?.session?.access_token;
            if (!accessToken) throw new Error("User not authenticated");

            // construct payload for player/defense updates
            const payload = {
                leagueId: selectedLeagueData?.leagueId,
                memberId: defense.team.id,
                isDefense: true
            };

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/UpdateUserLeague/member`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

            if (!res.ok) throw new Error();

            refreshUserData();
            setShowOverlay(false);
        } catch (e) {
            alert("Failed to delete defense from your league's roster");
            console.error(e);
        }
    }

    return (
        <AppNavWrapper title="ROSTER DASHBOARD" button1={(selectedLeagueData?.players?.length ?? 0) > 0 ? adviceButton : editButton} button2={leagueDropdown}>
            {selectedLeagueData ?
                ((selectedLeagueData.players?.length ?? 0) > 0 || (selectedLeagueData.defenses?.length ?? 0) > 0) ?
                    (
                        <PlayerList
                            players={selectedLeagueData.players ?? []}
                            onPlayerClick={onPlayerClick}
                            defenses={selectedLeagueData.defenses ?? []}
                            onDefenseClick={onDefenseClick}
                        />
                    ) : <NoDataMessage>Your roster is empty. Click edit roster to add players to your roster for this league.</NoDataMessage>
                : (
                    <NoDataMessage>No league selected</NoDataMessage>
                )}

            {/* overlay */}
            {
                showOverlay &&
                <Overlay isOpen={showOverlay} onClose={() => setShowOverlay(false)}>
                    {selectedPlayer && <PlayerStatsOverlay player={selectedPlayer} onPlayerDelete={onPlayerDelete} />}
                    {selectedDefense && <DefenseStatsOverlay defense={selectedDefense} onDeleteDefense={onDefenseDelete} />}
                </Overlay>
            }
        </AppNavWrapper>
    )
}