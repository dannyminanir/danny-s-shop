// "Visible" (green) or "Hidden" (grey) label used in the admin screens
export default function ProductStatusBadge({ isHidden }: { isHidden: boolean }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        isHidden ? "bg-slate-200 text-slate-600" : "bg-emerald-100 text-emerald-700"
      }`}
    >
      {isHidden ? "Hidden" : "Visible"}
    </span>
  );
}
