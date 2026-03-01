import PublicShell from "@/components/public-shell";
import LeaderboardPage from "@/pages/leaderboard";

export default function LeaderboardPublicPage() {
  return (
    <PublicShell
      title="Global Rankings"
      subtitle="Top operatives sorted by combat rating (ELO) across the Battleroof network."
      backgroundImage="/images/freefire.webp"
    >
      <LeaderboardPage />
    </PublicShell>
  );
}
