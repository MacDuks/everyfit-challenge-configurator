export function Button({ className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-all ${className}`}
      {...props}
    />
  );
}
