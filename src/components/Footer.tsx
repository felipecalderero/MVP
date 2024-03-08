import Link from "next/link";

const Footer = () => {
  return ( 
    <footer className="w-full myFlex bg-[#134731] text-white pt-8 pb-5 source-sans">
      <div className="flex items-start justify-start flex-col gap-y-7 w-full myContainer">
        {/* Home - All Courses */}
        <div className="myFlex gap-x-10 text-[12.5px] font-light tracking-wider">
          <Link href="/">HOME</Link>
          <Link href="/collections">ALL COURSES</Link>
        </div>

        {/* Copyright */}
        <div className="opacity-80 text-[11.5px] font-light tracking-wider">
          Copyright My Mental Wellbeing Innovation Limited 2021
        </div>
        
      </div>
    </footer>
   );
}
 
export default Footer;