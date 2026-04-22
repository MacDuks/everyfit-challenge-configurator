export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full border px-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[#F97316] ${className}`}
      {...props}
    />
  );
}
