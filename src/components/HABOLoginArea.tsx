import { LoginArea } from "@/components/auth/LoginArea";

export function HABOLoginArea({ className }: { className?: string }) {
  return (
    <div className={`[&_button]:!border-amber-500 [&_button]:!text-amber-400 [&_button]:!bg-amber-500/10 [&_button]:hover:!bg-amber-500/20 [&_button]:hover:!text-amber-300 [&_button]:font-semibold ${className}`}>
      <LoginArea className="w-full" />
    </div>
  );
}
