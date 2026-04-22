export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`w-full border px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[#F97316] ${className}`}
      {...props}
    />
  );
}
