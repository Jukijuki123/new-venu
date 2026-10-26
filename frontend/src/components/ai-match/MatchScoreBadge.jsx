export default function MatchScoreBadge({
  score,
}) {
  const getStyle = () => {
    if (score >= 90) {
      return "bg-[#EAF8F0] text-[#16834A]";
    }

    if (score >= 70) {
      return "bg-[#EAF3FF] text-[#1677C8]";
    }

    return "bg-[#FFF4E5] text-[#D97706]";
  };

  return (
    <span
      className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-bold ${getStyle()}`}
    >
      {score}% Cocok
    </span>
  );
}