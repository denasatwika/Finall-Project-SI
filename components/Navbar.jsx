"use client"
import React from "react";
import { assets, CartIcon, BagIcon} from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";
import { useUser, SignOutButton } from "@clerk/nextjs";



const Navbar = () => {

  const { isSeller, router, user } = useAppContext();
  const { openSignIn } = useClerk();
  


  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <Image
        className="cursor-pointer w-28 md:w-32"
        onClick={() => router.push('/')}
        src={assets.invo}
        alt="logo"
      />
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">
          Home
        </Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">
          All Products
        </Link>
        <Link href="/" className="hover:text-gray-900 transition">
          About Us
        </Link>
        <Link href="/" className="hover:text-gray-900 transition">
          Contact
        </Link>

        {/* {isSeller && <button onClick={() => router.push('/seller')} className="text-xs border px-4 py-1.5 rounded-full">Admin Dashboard</button>} */}

      </div>

      <ul className="flex items-center gap-6">
          <li>
          <button className="hover:text-gray-600">
            <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
          </button>
        </li>
        <li>
          <button onClick={() => router.push("/cart")} className="flex items-center gap-1 hover:text-gray-600">
            <CartIcon className="w-5 h-5" />
            <span className="hidden md:inline">Cart</span>
          </button>
        </li>

        {user && (
          <>
            <li>
              <button onClick={() => router.push("/my-orders")} className="flex items-center gap-1 hover:text-gray-600">
                <BagIcon className="w-5 h-5" />
                <span className="hidden md:inline">My Loan</span>
              </button>
            </li>

            {/* {isSeller && (
              <li>
                <button onClick={() => router.push("/seller")} className="flex items-center gap-1 border px-3 py-1 rounded-full text-sm hover:bg-gray-100">
                  Seller Dashboard
                </button>
              </li>
            )} */}

            <li>
              <UserButton afterSignOutUrl="/" userProfileMode="navigation" />
            </li>
          </>
        )}

        {!user && (
          <li>
                <button
                  onClick={openSignIn}
                  className="flex items-center gap-2 hover:text-gray-900 transition"
                >
                  <Image src={assets.user_icon} alt="user icon" />
                  Account
                </button>
          </li>
        )}
      </ul>
        

{/* untuk mobile */}
      <div className="flex items-center md:hidden gap-3">
        {isSeller && <button onClick={() => router.push('/seller')} className="text-xs border px-4 py-1.5 rounded-full">Seller Dashboard</button>}
        <button onClick={openSignIn} className="flex items-center gap-2 hover:text-gray-900 transition">
          <Image src={assets.user_icon} alt="user icon" />
          Account
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
