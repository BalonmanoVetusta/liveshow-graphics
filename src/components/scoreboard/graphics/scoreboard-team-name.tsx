export function ScoreboardTeamName({ name = "TEAM", show = false }: { name?: string; show?: boolean }) {
  if (!show) return null;

  return (
    <>
      <div className="team-name">
        <p>{name}</p>
      </div>
    </>
  );
}
