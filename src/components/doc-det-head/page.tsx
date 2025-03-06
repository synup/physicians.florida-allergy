"use client"
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";


export default function DocDetHeader({ getlocation }) {

  const [isOpen, setIsOpen] = useState(false);


  function openmenu() {
    if (!isOpen) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }

  return (
    <>
      <header className="page-header ">
        <div className="container relative nav-bar px-[15px] mx-auto flex py-4">
          <div className="flex items-center md:space-x-3">
            <Image
              src="/img/logo.png"
              alt="Florida Center Logo"
              width={268}
              height={80}
              className="logo"
            />
          </div>
          <button onClick={openmenu} className="md:hidden p-2 ml-auto text-[#3fae49] focus:outline-none">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          <div
            className={`absolute text-[#3fae49] py-[15px] md:py-[0px] md:static md:block top-[100%] left-0 w-full z-[100] bg-white shadow-md md:shadow-none transition-all duration-500 ease-in-out transform ${isOpen ? "translate-x-0 opacity-100" : "md:translate-x-0 translate-x-full md:opacity-100 opacity-0"
              }`}
          >
            <p className="text-[15px] hover:text-[#3FB618] p-[8px] mx-[15px] md:mx-[15px] mt-[0px]">
              {getlocation?.phone && (
                <a href={`tel:${getlocation?.phone}`}>{getlocation?.phone}</a>
              )}
            </p>
            <nav className="flex flex-col space-y-1 text-[15px] text-left ">
              <Link
                href="/"
                className="hover:text-[#3FB618]  p-[8px] mx-[15px] !mt-[0px]"
              >
                LOCATIONS
              </Link>
              <Link
                href="/"
                className="hover:text-[#3FB618]  p-[8px] mx-[15px] !mt-[0px]"
              >
                SERVICES
              </Link>
              <Link
                href="/"
                className="hover:text-[#3FB618]  p-[8px] mx-[15px] !mt-[0px]"
              >
                NEW PATIENT FORMS
              </Link>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
