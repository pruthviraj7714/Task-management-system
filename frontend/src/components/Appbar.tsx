"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Appbar() {
  const router = useRouter();
  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <Link href={"/home"} className="text-2xl font-bold">
          Task Master
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <a href="/task/create" className="hover:text-blue-400">
            Create Task
          </a>
          <a href="/board-view" className="hover:text-blue-400">
           Board View
          </a>
          <Button
            variant={"destructive"}
            onClick={() => {
              localStorage.removeItem("token");
              toast.success("successfully Logged out!");
              router.push("/");
            }}
          >
            Logout
          </Button>
        </nav>
      </div>
    </header>
  );
}
