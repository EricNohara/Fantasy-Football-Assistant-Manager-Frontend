import { ILeagueData } from "@/app/interfaces/IUserData";

export default function getRosterSlotsFromPosition(
  league: ILeagueData | null,
  position: string
) {
  if (!league) return -1;

  switch (position) {
    case "QB":
      return league.rosterSettings.qb_count;
    case "RB":
      return league.rosterSettings.rb_count;
  }
}
