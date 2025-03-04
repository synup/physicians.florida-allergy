import Link from "next/link";

export default function HomeHeader() {
  return (
    <div className="py-[30px] px-[15px] bg-[#f8f9fa]">
      <div className=" container  mx-auto">
        <Link href="/" className="text-[#00000080] text-center md:text-start">
          Link to Finder
        </Link>
      </div>
    </div>
  );
}
