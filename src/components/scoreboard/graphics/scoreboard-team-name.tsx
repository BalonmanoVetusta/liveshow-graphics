export function ScoreboardTeamName({
  name,
  show = true,
}: {
  name?: string;
  show?: boolean;
}) {
  if (!show) return null;

  return (
    <>
      <div className="team-name">
        <p>{name}</p>
      </div>
    </>
  );
}
