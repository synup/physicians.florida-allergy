import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function InternalPagesFooter({ result }) {
  const ExcelDataKeys: any = {
    "synup_id": 0,
    "npi": 1,
    "first_name": 2,
    "middle_initial": 3,
    "last_name": 4,
    "degrees": 5,
    "title": 6,
    "doctor_website_url": 7,
    "office_name": 8,
    "office_website_url": 9,
    "address_line_1": 10,
    "address_line_2": 11,
    "state": 12,
    "postal_code": 13,
    "county": 14,
    "website_url": 15,
    "toll_free": 16,
    "instagram": 17,
    "facebook": 18,
    "linkedin": 19,
    "pictureUrl": 20
  };
  
  return (
    <footer className="bg-gray-100 px-[15px] py-6">
      <div className="container mx-auto flex flex-col justify-center md:judtify-none  text-gray-600">
        {/* Navigation Links */}
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center md:items-start mb-4 md:mb-0">
          <div className="flex flex-col md:flex-row space-x-6 mb-4 text-[#212529]">
            <Link href="https://florida-allergy.com/news-blog/" className="underline hover:no-underline">
              News & Blog
            </Link>
            <Link href="https://florida-allergy.com/glossary/" className="underline hover:no-underline">
              Glossary
            </Link>
            <Link href="https://florida-allergy.com/research/" className="underline hover:no-underline">
              Research
            </Link>
          </div>
          <div className="flex space-x-4">
            <a href={result[ExcelDataKeys["facebook"]]} className="text-gray-500 hover:text-gray-800">
              <FaFacebookF size={20} />
            </a>
            <a href={result[ExcelDataKeys["instagram"]]} className="text-gray-500 hover:text-gray-800">
              <FaInstagram size={20} />
            </a>
            <a href={result[ExcelDataKeys["linkedin"]]} className="text-gray-500 hover:text-gray-800">
              <FaLinkedinIn size={20} />
            </a>

          </div>
          {/* Copyright */}

        </div>

        {/* Social Icons */}
        <div className="text-center md:text-left">
          <p className="text-[15px] text-[#373A3C]">
            © 2012 - 2023 - Florida Center For Allergy & Asthma Care. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
