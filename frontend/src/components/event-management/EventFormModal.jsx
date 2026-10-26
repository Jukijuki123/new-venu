import { useState } from "react";
import Button from "../common/Button";

const CATEGORIES = ["Makanan", "Minuman", "Kerajinan", "Aksesoris", "Fashion"];

const EMPTY_FORM = {
  name: "",
  category: CATEGORIES[0],
  description: "",
  event_date: "",
  location: "",
  target_visitors: "",
  booth_capacity: "",
  booth_price: "",
};

export default function EventFormModal({ onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      await onSubmit({
        ...form,
        target_visitors: form.target_visitors ? Number(form.target_visitors) : null,
        booth_capacity: Number(form.booth_capacity),
        booth_price: Number(form.booth_price),
      });
    } catch (err) {
      // Laravel FormRequest balikin { success:false, errors: { field: [msg] } }
      setErrors(err.response?.data?.errors || {});
    } finally {
      setSubmitting(false);
    }
  };

  const fieldError = (field) => errors[field]?.[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 px-4">
      <div className="w-full max-w-lg rounded-xl2 bg-white p-6 shadow-lg">
        <h2 className="text-xl font-extrabold text-navy">Buat Event Baru</h2>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-navy">Nama Event</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border border-navy/20 px-3 py-2 text-sm focus:border-navy focus:outline-none"
            />
            {fieldError("name") && <p className="mt-1 text-xs text-red-600">{fieldError("name")}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-navy">Kategori</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-navy/20 px-3 py-2 text-sm focus:border-navy focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy">Tanggal Event</label>
              <input
                type="date"
                name="event_date"
                value={form.event_date}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-lg border border-navy/20 px-3 py-2 text-sm focus:border-navy focus:outline-none"
              />
              {fieldError("event_date") && <p className="mt-1 text-xs text-red-600">{fieldError("event_date")}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy">Lokasi</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border border-navy/20 px-3 py-2 text-sm focus:border-navy focus:outline-none"
            />
            {fieldError("location") && <p className="mt-1 text-xs text-red-600">{fieldError("location")}</p>}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-semibold text-navy">Target Pengunjung</label>
              <input
                type="number"
                name="target_visitors"
                value={form.target_visitors}
                onChange={handleChange}
                min="0"
                className="mt-1 w-full rounded-lg border border-navy/20 px-3 py-2 text-sm focus:border-navy focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy">Kapasitas Booth</label>
              <input
                type="number"
                name="booth_capacity"
                value={form.booth_capacity}
                onChange={handleChange}
                min="1"
                required
                className="mt-1 w-full rounded-lg border border-navy/20 px-3 py-2 text-sm focus:border-navy focus:outline-none"
              />
              {fieldError("booth_capacity") && <p className="mt-1 text-xs text-red-600">{fieldError("booth_capacity")}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-navy">Harga Booth (Rp)</label>
              <input
                type="number"
                name="booth_price"
                value={form.booth_price}
                onChange={handleChange}
                min="0"
                required
                className="mt-1 w-full rounded-lg border border-navy/20 px-3 py-2 text-sm focus:border-navy focus:outline-none"
              />
              {fieldError("booth_price") && <p className="mt-1 text-xs text-red-600">{fieldError("booth_price")}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy">Deskripsi (opsional)</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full rounded-lg border border-navy/20 px-3 py-2 text-sm focus:border-navy focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" variant="accent" disabled={submitting}>
              {submitting ? "Menyimpan..." : "Simpan sebagai Draft"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}