import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPinterest,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-100 px-[15px] py-6">
      <div className="container mx-auto flex flex-col justify-center md:judtify-none  text-gray-600">
        {/* Navigation Links */}
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center md:items-start mb-4 md:mb-0">
          <div className="flex flex-col md:flex-row space-x-6 mb-4 text-[#212529]">
            <Link href="/" className="underline hover:no-underline">
              Terms of Service
            </Link>
            <Link href="/" className="underline hover:no-underline">
              Sitemap
            </Link>
          </div>
          <div className="flex space-x-4">
          <a href="#" className="text-gray-500 hover:text-gray-800">
            <FaFacebookF size={20} />
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-800">
          <FaYoutube size={20} />
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-800">
          <FaPinterest size={20} />
          </a>
         
        </div>
          {/* Copyright */}
          
        </div>

        {/* Social Icons */}
        <div className="text-center md:text-left">
          <p className="text-[15px] text-[#373A3C]">
            © {new Date().getFullYear()} Cobalt Design System. All Rights Reserved.
          </p>
          </div>
       
      </div>
    </footer>
  );
}
