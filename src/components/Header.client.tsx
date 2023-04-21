"use client";

import { useAuthContext } from "@/context/AuthContext";
import Link from "next/link";
import Button from "./Button.client";
import { signOut } from "@/lib/firebase";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    text: "Expenses",
    href: "/expenses",
  },
  {
    text: "Gifts",
    href: "/gifts",
  },
];

function Header() {
  const { user } = useAuthContext();

  const path = usePathname();

  return (
    <header
      className={`fixed z-30 w-full border-b-[1px] border-[#26252e] bg-black`}
    >
      <nav className="flex items-center justify-between px-6 py-4">
        {/* ADD LOGO */}
        {/* <Link href="/" /> */}
        <ul className="flex w-full justify-around gap-3 sm:gap-5 md:gap-8">
          {NAV_ITEMS.map((item, i) => (
            <li key={`${item.text} - ${i}`}>
              <Link
                className={`px-2 transition-colors duration-200 hover:text-gray-200 ${
                  path === item.href ? "text-white" : ""
                }`}
                href={item.href}
                shallow
              >
                {item.text}
              </Link>
            </li>
          ))}
          <li>
            {user ? (
              <Button
                onClick={() => {
                  signOut();
                }}
                className="text-red-600"
              >
                Logout
              </Button>
            ) : (
              <Link shallow className="font-semibold" href={"/auth/sign-in"}>
                Login
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
