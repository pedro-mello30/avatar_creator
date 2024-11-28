import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface AuthButtonProps {
  type: "signin" | "signup";
  className?: string;
}

export default function AuthButton({ type, className }: AuthButtonProps) {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    if (isSignedIn) {
      router.push("/dashboard");
    } else {
      router.push(type === "signin" ? "/login" : "/signup");
    }
  };

  return (
    <button
      onClick={handleClick}
      className={className}
    >
      {type === "signin" ? "Sign in" : "Get started"}
    </button>
  );
}
