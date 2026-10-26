import { FiEdit2 } from "react-icons/fi";

function formatValue(field, raw) {
  if (raw == null || raw === "") return null;
  if (field.type === "number" && raw != null && raw !== "") {
    const n = Number(raw);
    if (!Number.isNaN(n)) return "Rp" + n.toLocaleString("id-ID");
  }
  if (field.type === "select" && field.options) {
    const opt = field.options.find((o) => String(o.value) === String(raw));
    if (opt) return opt.label;
  }
  return String(raw);
}

export default function ProfileCard({ title, icon: Icon, iconBg, iconColor, fields, data, onEdit, readonly }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E7E5E4] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#F1F0EF] bg-[#FAFAF9] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}>
            <Icon size={20} className={iconColor} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#111827]">{title}</h2>
          </div>
        </div>
        {!readonly && onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#E7E5E4] bg-white px-3 py-2 text-xs font-semibold text-[#6B7280] transition-all hover:border-[#1677C8] hover:text-[#1677C8]"
          >
            <FiEdit2 size={13} />
            Edit
          </button>
        )}
      </div>

      <div className="divide-y divide-[#F1F0EF]">
        {fields.map((field) => {
          const raw = data?.[field.key];
          const formatted = formatValue(field, raw);
          const isEmpty = formatted == null;
          const display = isEmpty ? "—" : formatted;

          return (
            <div key={field.key} className="flex items-center justify-between gap-4 px-6 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isEmpty ? "bg-[#F9FAFB]" : iconBg}`}>
                  <field.icon size={15} className={isEmpty ? "text-[#D1D5DB]" : iconColor} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">{field.label} {field.hint && <span className="tracking-normal normal-case">· {field.hint}</span>}</p>
                  <p className={`mt-0.5 truncate text-sm font-semibold ${isEmpty ? "text-[#D1D5DB]" : "text-[#374151]"}`}>
                    {display}
                  </p>
                </div>
              </div>
              {field.description && !isEmpty && (
                <p className="hidden max-w-[260px] text-right text-xs leading-5 text-[#6B7280] md:block">{field.description}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
