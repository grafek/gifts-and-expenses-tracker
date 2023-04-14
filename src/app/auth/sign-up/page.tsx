"use client";

import Button from "@/components/Button.client";
import Input from "@/components/Input.client";
import { Spinner } from "@/components/Loaders.server";
import { googleSignIn, signUp } from "@/lib/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export default function Page() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const submitHandler = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      setLoading(true);
      event.preventDefault();

      const error = await signUp(name, email, password);
      if (error) {
        setError(error.toString());
        setLoading(false);
        return;
      }
      router.push("/expenses");
    },
    [email, name, password, router]
  );
  return (
    <div className="flex w-full flex-col gap-8 border-[1px] border-gray-800 bg-black pb-8 pt-10 sm:w-2/3 xl:w-1/3">
      <form
        onSubmit={submitHandler}
        className="mx-auto flex flex-col gap-6 rounded-sm px-4"
      >
        <div className="relative">
          <Input
            labelname="Name"
            type="text"
            required
            name={"Name"}
            value={name}
            error={error?.includes("name") ? error : null}
            autoComplete="given-name"
            onChange={(e) => {
              setError(null);
              setName(e.target.value);
            }}
          />
        </div>
        <div className="relative">
          <Input
            labelname="E-mail"
            type="email"
            required
            name={"E-mail"}
            value={email}
            error={error?.includes("Email") ? error : null}
            autoComplete="email"
            onChange={(e) => {
              setError(null);
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="relative">
          <Input
            labelname="Password"
            type="password"
            required
            value={password}
            error={error?.includes("password") ? error : null}
            autoComplete="current-password"
            onChange={(e) => {
              setError(null);
              setPassword(e.target.value);
            }}
            name={"Password"}
          />
        </div>
        {error ? (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        ) : null}
        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={loading ? true : false}
            className="relative flex w-full items-center justify-center px-4 py-2 text-lg outline outline-1 outline-gray-700 transition-colors duration-300 hover:bg-white/90 hover:text-black"
          >
            <span className="flex-1">Register</span>
            {loading ? <Spinner /> : null}
          </Button>
        </div>
        <Link
          href={"/auth/sign-in"}
          className="text-center text-sm uppercase text-gray-500 transition-colors duration-300 hover:text-white"
        >
          Login
        </Link>
      </form>
      <div className="flex items-center justify-between gap-4 px-4">
        <div className="h-[1px] flex-1 bg-gray-800" />
        <span className="text-sm uppercase text-gray-700">or</span>
        <div className="h-[1px] flex-1 bg-gray-800" />
      </div>
      <div className="flex flex-col items-center justify-center gap-6">
        <Button
          className="relative flex items-center justify-center px-4 py-2 text-lg outline outline-1 outline-gray-700 transition-colors duration-300 hover:bg-white/90 hover:text-black"
          onClick={async () => {
            const error = await googleSignIn();
            error ? setError(error) : router.push("/expenses");
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 32 32"
            width="24"
            height="24"
            className="mr-2"
          >
            <defs>
              <path
                id="A"
                d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
              />
            </defs>
            <clipPath id="B">
              <use xlinkHref="#A" />
            </clipPath>
            <g transform="matrix(.727273 0 0 .727273 -.954545 -1.45455)">
              <path d="M0 37V11l17 13z" clipPath="url(#B)" fill="#fbbc05" />
              <path
                d="M0 11l17 13 7-6.1L48 14V0H0z"
                clipPath="url(#B)"
                fill="#ea4335"
              />
              <path
                d="M0 37l30-23 7.9 1L48 0v48H0z"
                clipPath="url(#B)"
                fill="#34a853"
              />
              <path
                d="M48 48L17 24l-4-3 35-10z"
                clipPath="url(#B)"
                fill="#4285f4"
              />
            </g>
          </svg>
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
