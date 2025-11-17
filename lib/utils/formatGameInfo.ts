import { IGameData, IPlayerInfo } from "@/app/interfaces/IUserData";

export function formatGameInfo(game: IGameData, player: IPlayerInfo): string {
  if (!game || !player) return "";

  // Parse game datetime
  const gameDate = new Date(game.game_datetime);

  // Format weekday and time (e.g., "Sun 4:25PM")
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  const formattedTime = new Intl.DateTimeFormat("en-US", options).format(
    gameDate
  );

  // Determine if the player is home or away
  const isHome = player.team_id === game.home_team;
  const vsOrAt = isHome ? "vs" : "@";

  // Determine opponent team
  const opponent = isHome ? game.away_team : game.home_team;

  return `${formattedTime} ${vsOrAt} ${opponent}`;
}
