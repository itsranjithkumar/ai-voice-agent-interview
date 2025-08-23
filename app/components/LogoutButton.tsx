"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/sign-in");
  };

  return (
    <Button className="btn-secondary ml-4" onClick={handleLogout}>
      Logout
    </Button>
  );
}
