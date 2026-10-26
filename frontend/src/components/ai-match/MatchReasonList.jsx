import { FiCheck } from "react-icons/fi";

export default function MatchReasonList({
  reasons = [],
}) {
  if (!reasons.length) {
    return (
      <p className="text-sm text-[#94A3B8]">
        Belum ada kecocokan spesifik.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {reasons.map((reason) => (
        <div
          key={reason}
          className="flex items-center gap-3 text-sm text-[#52657A]"
        >
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FFF4E5] text-[#F59E0B]">
            <FiCheck size={12} />
          </div>

          <span>{reason}</span>
        </div>
      ))}
    </div>
  );
}