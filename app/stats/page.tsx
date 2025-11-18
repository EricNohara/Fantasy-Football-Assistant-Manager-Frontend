"use client";

import AppNavWrapper from "../components/AppNavWrapper";
import { useUserData } from "../context/UserDataProvider";
import { useEffect, useState } from "react";
import { ILeagueData, IPlayerData, ILeagueDefense } from "../interfaces/IUserData";
import styled from "styled-components";
import { formatGameInfo, formatTeamGameInfo } from "@/lib/utils/formatGameInfo";
import { headerFont } from "../localFont";

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

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PlayerCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  border-radius: var(--global-border-radius);
  background-color: var(--color-base-dark-3);
  color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    cursor: pointer;
  }
`;

const PlayerSimpleData = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const PlayerImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  background-color: white;
`;

const PlayerInfo = styled.div`
  display: flex;
  gap: 2rem;
`;

const PlayerStartInfo = styled.div`
  display: flex;
  gap: 2rem;
  justify-self: end;
`;

const PlayerName = styled.span`
  font-weight: bold;
  font-size: 1rem;
`;

const PlayerData = styled.span`
  font-size: 0.9rem;
  color: var(--color-txt-3);
`;

const AddButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: var(--global-border-radius);
  background-color: var(--color-primary);
  color: white;
  font-weight: bold;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background-color: var(--color-primary-dark);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.98);
  }
`;

interface IPlayerPositionTagProps {
  position: string;
}

const positionColors: Record<string, string> = {
  QB: "#E68544",
  RB: "#DE742C",
  WR: "#C75000",
  TE: "#9E3F00",
  K: "#744C32",
  DEF: "#593B26",
};

const PlayerPositionTag = styled.div<IPlayerPositionTagProps>`
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: var(--global-border-radius);
  background-color: ${({ position }) => positionColors[position] ?? "gray"};
  font-weight: bold;
  color: white;
`;

const POSITION_ORDER = ["QB", "RB", "WR", "TE", "K"];

//dummy data - just placeholders
const DUMMY_PLAYERS: IPlayerData[] = [
  {
    player: { id: "1", name: "QB Player", position: "QB", status: null, team_id: "KC", headshot_url: null, season_stats_id: null, status_description: null },
    game: { id: "g1", weekday: "Sun", away_team: "KC", home_team: "BUF", over_odds: 0, total_line: 0, under_odds: 0, spread_line: 0, stadium_name: "", game_datetime: "2025-11-17T13:00:00", stadium_style: "", away_moneyline: 0, away_rest_days: 0, home_moneyline: 0, home_rest_days: 0, away_spread_odds: 0, home_spread_odds: 0, is_divisional_game: false },
    picked: false,
    opponent: { team: { id: "BUF", name: "Buffalo", division: "", logo_url: "", conference: "", defensive_stats_id: null, offensive_stats_id: null }, defensiveStats: { id: "d1", def_tds: null, safeties: null, sacks_for: null, fumbles_for: null, pass_defended: null, sack_yards_for: null, tackles_for_loss: null, interceptions_for: null, interception_yards_for: null, tackle_for_loss_yards: null } },
    seasonStats: { id: "s1", carries: null, targets: null, receptions: null, completions: null, passing_epa: null, passing_tds: null, pat_percent: null, rushing_epa: null, rushing_tds: null, fg_made_list: null, pat_attempts: null, passing_yards: null, receiving_epa: null, receiving_tds: null, rushing_yards: null, sacks_against: null, fantasy_points: null, fg_missed_list: null, fg_blocked_list: null, fumbles_against: null, receiving_yards: null, passing_attempts: null, fantasy_points_ppr: null, passing_first_downs: null, rushing_first_downs: null, interceptions_against: null, receiving_first_downs: null },
    weeklyStats: []
  },
  {
    player: { id: "2", name: "RB Player", position: "RB", status: null, team_id: "SF", headshot_url: null, season_stats_id: null, status_description: null },
    game: { id: "g2", weekday: "Sun", away_team: "SF", home_team: "DAL", over_odds: 0, total_line: 0, under_odds: 0, spread_line: 0, stadium_name: "", game_datetime: "2025-11-17T13:00:00", stadium_style: "", away_moneyline: 0, away_rest_days: 0, home_moneyline: 0, home_rest_days: 0, away_spread_odds: 0, home_spread_odds: 0, is_divisional_game: false },
    picked: false,
    opponent: { team: { id: "DAL", name: "Dallas", division: "", logo_url: "", conference: "", defensive_stats_id: null, offensive_stats_id: null }, defensiveStats: { id: "d2", def_tds: null, safeties: null, sacks_for: null, fumbles_for: null, pass_defended: null, sack_yards_for: null, tackles_for_loss: null, interceptions_for: null, interception_yards_for: null, tackle_for_loss_yards: null } },
    seasonStats: { id: "s2", carries: null, targets: null, receptions: null, completions: null, passing_epa: null, passing_tds: null, pat_percent: null, rushing_epa: null, rushing_tds: null, fg_made_list: null, pat_attempts: null, passing_yards: null, receiving_epa: null, receiving_tds: null, rushing_yards: null, sacks_against: null, fantasy_points: null, fg_missed_list: null, fg_blocked_list: null, fumbles_against: null, receiving_yards: null, passing_attempts: null, fantasy_points_ppr: null, passing_first_downs: null, rushing_first_downs: null, interceptions_against: null, receiving_first_downs: null },
    weeklyStats: []
  },
  {
    player: { id: "3", name: "WR Player", position: "WR", status: null, team_id: "MIA", headshot_url: null, season_stats_id: null, status_description: null },
    game: { id: "g3", weekday: "Sun", away_team: "MIA", home_team: "NYJ", over_odds: 0, total_line: 0, under_odds: 0, spread_line: 0, stadium_name: "", game_datetime: "2025-11-17T13:00:00", stadium_style: "", away_moneyline: 0, away_rest_days: 0, home_moneyline: 0, home_rest_days: 0, away_spread_odds: 0, home_spread_odds: 0, is_divisional_game: false },
    picked: false,
    opponent: { team: { id: "NYJ", name: "NY Jets", division: "", logo_url: "", conference: "", defensive_stats_id: null, offensive_stats_id: null }, defensiveStats: { id: "d3", def_tds: null, safeties: null, sacks_for: null, fumbles_for: null, pass_defended: null, sack_yards_for: null, tackles_for_loss: null, interceptions_for: null, interception_yards_for: null, tackle_for_loss_yards: null } },
    seasonStats: { id: "s3", carries: null, targets: null, receptions: null, completions: null, passing_epa: null, passing_tds: null, pat_percent: null, rushing_epa: null, rushing_tds: null, fg_made_list: null, pat_attempts: null, passing_yards: null, receiving_epa: null, receiving_tds: null, rushing_yards: null, sacks_against: null, fantasy_points: null, fg_missed_list: null, fg_blocked_list: null, fumbles_against: null, receiving_yards: null, passing_attempts: null, fantasy_points_ppr: null, passing_first_downs: null, rushing_first_downs: null, interceptions_against: null, receiving_first_downs: null },
    weeklyStats: []
  },
  {
    player: { id: "4", name: "TE Player", position: "TE", status: null, team_id: "KC", headshot_url: null, season_stats_id: null, status_description: null },
    game: { id: "g4", weekday: "Sun", away_team: "PHI", home_team: "WAS", over_odds: 0, total_line: 0, under_odds: 0, spread_line: 0, stadium_name: "", game_datetime: "2025-11-17T13:00:00", stadium_style: "", away_moneyline: 0, away_rest_days: 0, home_moneyline: 0, home_rest_days: 0, away_spread_odds: 0, home_spread_odds: 0, is_divisional_game: false },
    picked: false,
    opponent: { team: { id: "WAS", name: "Washington", division: "", logo_url: "", conference: "", defensive_stats_id: null, offensive_stats_id: null }, defensiveStats: { id: "d4", def_tds: null, safeties: null, sacks_for: null, fumbles_for: null, pass_defended: null, sack_yards_for: null, tackles_for_loss: null, interceptions_for: null, interception_yards_for: null, tackle_for_loss_yards: null } },
    seasonStats: { id: "s4", carries: null, targets: null, receptions: null, completions: null, passing_epa: null, passing_tds: null, pat_percent: null, rushing_epa: null, rushing_tds: null, fg_made_list: null, pat_attempts: null, passing_yards: null, receiving_epa: null, receiving_tds: null, rushing_yards: null, sacks_against: null, fantasy_points: null, fg_missed_list: null, fg_blocked_list: null, fumbles_against: null, receiving_yards: null, passing_attempts: null, fantasy_points_ppr: null, passing_first_downs: null, rushing_first_downs: null, interceptions_against: null, receiving_first_downs: null },
    weeklyStats: []
  },
];

const DUMMY_DEFENSES: ILeagueDefense[] = [
  {
    team: { id: "BAL", name: "Baltimore Ravens", division: "AFC North", logo_url: "", conference: "AFC", defensive_stats_id: null, offensive_stats_id: null },
    game: { id: "g5", weekday: "Sun", away_team: "BAL", home_team: "CLE", over_odds: 0, total_line: 0, under_odds: 0, spread_line: 0, stadium_name: "", game_datetime: "2025-11-17T13:00:00", stadium_style: "", away_moneyline: 0, away_rest_days: 0, home_moneyline: 0, home_rest_days: 0, away_spread_odds: 0, home_spread_odds: 0, is_divisional_game: false },
    picked: false,
    opponent: { team: { id: "CLE", name: "Cleveland Browns", division: "AFC North", logo_url: "", conference: "AFC", defensive_stats_id: null, offensive_stats_id: null }, offensiveStats: { id: "o1", carries: null, targets: null, attempts: null, receptions: null, completions: null, passing_tds: null, rushing_tds: null, passing_yards: null, receiving_tds: null, rushing_yards: null, sacks_against: null, fumbles_against: null, receiving_yards: null, passing_interceptions: null } },
    seasonStats: { id: "ds1", def_tds: null, safeties: null, sacks_for: null, fumbles_for: null, pass_defended: null, sack_yards_for: null, tackles_for_loss: null, interceptions_for: null, interception_yards_for: null, tackle_for_loss_yards: null }
  },
  {
    team: { id: "SF", name: "San Francisco 49ers", division: "NFC West", logo_url: "", conference: "NFC", defensive_stats_id: null, offensive_stats_id: null },
    game: { id: "g6", weekday: "Sun", away_team: "SF", home_team: "SEA", over_odds: 0, total_line: 0, under_odds: 0, spread_line: 0, stadium_name: "", game_datetime: "2025-11-17T13:00:00", stadium_style: "", away_moneyline: 0, away_rest_days: 0, home_moneyline: 0, home_rest_days: 0, away_spread_odds: 0, home_spread_odds: 0, is_divisional_game: false },
    picked: false,
    opponent: { team: { id: "SEA", name: "Seattle Seahawks", division: "NFC West", logo_url: "", conference: "NFC", defensive_stats_id: null, offensive_stats_id: null }, offensiveStats: { id: "o2", carries: null, targets: null, attempts: null, receptions: null, completions: null, passing_tds: null, rushing_tds: null, passing_yards: null, receiving_tds: null, rushing_yards: null, sacks_against: null, fumbles_against: null, receiving_yards: null, passing_interceptions: null } },
    seasonStats: { id: "ds2", def_tds: null, safeties: null, sacks_for: null, fumbles_for: null, pass_defended: null, sack_yards_for: null, tackles_for_loss: null, interceptions_for: null, interception_yards_for: null, tackle_for_loss_yards: null }
  },
];

export default function StatsPage() {
  const { userData } = useUserData();
  const [selectedLeagueData, setSelectedLeagueData] = useState<ILeagueData | null>(null);

  useEffect(() => {
    if (userData?.leagues && userData.leagues.length > 0) {
      setSelectedLeagueData(userData.leagues[0]);
    }
  }, [userData]);

  const handleLeagueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const leagueId = e.target.value;
    const league = userData?.leagues.find((l) => l.leagueId === leagueId) ?? null;
    setSelectedLeagueData(league);
  };

  const handleAddPlayer = (playerId: string, playerName: string) => {
    // TODO: Implement actual add player functionality
    alert(`Adding ${playerName} to your team!`);
  };

  const handleAddDefense = (teamId: string, teamName: string) => {
    // TODO: Implement actual add defense functionality
    alert(`Adding ${teamName} defense to your team!`);
  };

  const sortedPlayers = [...DUMMY_PLAYERS].sort((a, b) => {
    return POSITION_ORDER.indexOf(a.player.position) - POSITION_ORDER.indexOf(b.player.position);
  });

  const leagueDropdown = (
    <LeagueDropdown
      value={selectedLeagueData?.leagueId ?? ""}
      onChange={handleLeagueChange}
    >
      {userData?.leagues.map((league) => (
        <option key={league.leagueId} value={league.leagueId}>
          {league.leagueName}
        </option>
      ))}
    </LeagueDropdown>
  );

  return (
    <AppNavWrapper title="LEAGUE STATS" button2={leagueDropdown}>
      {selectedLeagueData ? (
        <>
          <Section>
            <SectionTitle>Offensive Players</SectionTitle>
            <ListWrapper>
              {sortedPlayers.map((playerData) => (
                <PlayerCard key={playerData.player.id}>
                  <PlayerSimpleData>
                    <PlayerPositionTag position={playerData.player.position}>
                      {playerData.player.position}
                    </PlayerPositionTag>
                    <PlayerImage
                      src={playerData.player.headshot_url ?? "/default_player.png"}
                      alt={playerData.player.name}
                    />
                    <PlayerInfo>
                      <PlayerName className={headerFont.className}>
                        {playerData.player.name}
                      </PlayerName>
                      <PlayerData>{playerData.player.team_id}</PlayerData>
                      <PlayerData>
                        {formatGameInfo(playerData.game, playerData.player)}
                      </PlayerData>
                      <PlayerData>{playerData.player.status_description}</PlayerData>
                    </PlayerInfo>
                  </PlayerSimpleData>
                  <PlayerStartInfo>
                    <AddButton
                      onClick={() =>
                        handleAddPlayer(playerData.player.id, playerData.player.name)
                      }
                    >
                      Add to Team
                    </AddButton>
                  </PlayerStartInfo>
                </PlayerCard>
              ))}
            </ListWrapper>
          </Section>

          <Section>
            <SectionTitle>Defenses</SectionTitle>
            <ListWrapper>
              {DUMMY_DEFENSES.map((def) => (
                <PlayerCard key={def.team.id}>
                  <PlayerSimpleData>
                    <PlayerPositionTag position="DEF">DEF</PlayerPositionTag>
                    <PlayerImage
                      src={def.team.logo_url ?? "/default_player.png"}
                      alt={def.team.name}
                    />
                    <PlayerInfo>
                      <PlayerName className={headerFont.className}>
                        {def.team.name}
                      </PlayerName>
                      <PlayerData>{def.team.id}</PlayerData>
                      <PlayerData>{formatTeamGameInfo(def.game, def)}</PlayerData>
                    </PlayerInfo>
                  </PlayerSimpleData>
                  <PlayerStartInfo>
                    <AddButton
                      onClick={() => handleAddDefense(def.team.id, def.team.name)}
                    >
                      Add to Team
                    </AddButton>
                  </PlayerStartInfo>
                </PlayerCard>
              ))}
            </ListWrapper>
          </Section>
        </>
      ) : (
        <p>No league selected</p>
      )}
    </AppNavWrapper>
  );
}
