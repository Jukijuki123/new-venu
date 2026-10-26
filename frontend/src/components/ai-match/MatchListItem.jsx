import MatchScoreBadge from "./MatchScoreBadge";

export default function MatchListItem({
  title,
  subtitle,
  score,
  isActive,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border p-5 text-left transition ${
        isActive
          ? "border-[#FFB54A] bg-[#FFFAF3]"
          : "border-[#D8E2EB] bg-white hover:border-[#B9C9D8]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-[17px] font-bold text-[#062B52]">
            {title}
          </h3>

          <p className="mt-1 text-sm text-[#94A3B8]">
            {subtitle}
          </p>
        </div>

        <div>
          
        </div>

        <MatchScoreBadge score={score} />
      </div>
    </button>
  );
}