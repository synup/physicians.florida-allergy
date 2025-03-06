import Link from "next/link";
import { IoReorderThreeOutline } from "react-icons/io5";

export default function HomeHeader() {
  return (
    <div className="py-[10px] md:py-[30px] px-[15px] bg-[#f8f9fa]">
      <div className=" container   mx-auto">
        <Link href="/" className="text-[#00000080] text-center md:text-start hidden md:block">
          Link to Finder
        </Link>
        <div className="flex justify-end md:hidden">
        <IoReorderThreeOutline size={28}/>
        </div>
       
      </div>
    </div>
  );
}
