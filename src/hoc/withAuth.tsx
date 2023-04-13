import { LoadingPage } from "@/components/Loaders.server";
import { useAuthContext } from "@/context/AuthContext";
import Link from "next/link";

const withAuth = <T extends {}>(Component: React.ComponentType<T>) =>
  function HOC(props: T) {
    const { user, loading } = useAuthContext();

    if (loading) return <LoadingPage />;

    return user ? (
      <Component {...props} />
    ) : (
      <p className="text-lg font-semibold">
        You must be{" "}
        <Link
          href={"/auth/sign-in"}
          className="italic underline decoration-slate-400 decoration-1 underline-offset-8 transition-colors duration-300 hover:text-slate-400"
        >
          logged in
        </Link>{" "}
        to access {Component.displayName}!
      </p>
    );
  };

export default withAuth;
