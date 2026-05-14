"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { clearAuthToken } from "@/utils/auth";

export function Navbar() {
  const router = useRouter();

  const handleSignOut = () => {
    clearAuthToken();
    router.push("/sign-in");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-primary)] bg-white/80 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
        <span className="font-semibold text-[var(--text-primary)] tracking-tight">
          BlogMS
        </span>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <LogOut size={15} />
          Sign out
        </Button>
      </div>
    </header>
  );
}
