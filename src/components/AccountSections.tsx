'use client'

import DeleteAccount from "@/modals/DeleteAccount";
import DeleteAccountProvider from "@/modals/DeleteAccountProvider";
import { useFirebaseUser } from "@/store/store";
import { Avatar } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AiFillSetting } from "react-icons/ai";
import { FaPowerOff, FaUserGraduate } from "react-icons/fa";
import { GiStarsStack } from "react-icons/gi";

const sections = [
  {
    name:"Profile",
    href: "/account",
    icon: <FaUserGraduate className="w-5 h-5"/>
  },
  {
    name:"Password",
    href: "/password",
    icon: <AiFillSetting className="w-5 h-5"/>
  },
]



const Sections = () => {

  const pathname = usePathname();
  const [user] = useFirebaseUser(state => [state.user]);
  
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [openDeleteProvider, setOpenDeleteProvider] = useState<boolean>(false);
  
  const handleDelete = () =>{
    if(user){
      if(user.provider !== "password"){
        setOpenDeleteProvider(true);
      }else{
        setOpenDelete(true);
      }
    }
  };

  return ( 
    <div className="flex flex-row md-xl:flex-col items-center md-xl:items-start justify-center md-xl:w-[200px] text-[13px] mb-10 md-xl:mb-0 bg-[#F5F5F5] py-0 md-xl:py-4 rounded-md source-sans">
      {/* Delete account modal */}
      {openDelete && <DeleteAccount setOpen={setOpenDelete}/>}
      {openDeleteProvider && <DeleteAccountProvider setOpen={setOpenDeleteProvider}/>}

      {sections.map((section, i)=> (
        <Link 
          key={section.name} 
          href={section.href}
          className={`px-[9px] py-[7px] tracking-wide md-xl:border-l-[5px] ${i === 0 && "rounded-tl-md rounded-bl-md md-xl:rounded-none"} ${i === sections.length && "rounded-tr-md rounded-br-md md-xl:rounded-none"} ${pathname === section.href ? "text-white md-xl:text-[#DC4E27] bg-[#DC4E27] md-xl:bg-[#F5F5F5] md-xl:border-[#DC4E27]" : "border-transparent"}`}
        >
          {section.name}
        </Link>
      ))}
      <p 
        className="md-xl:border-l-[5px] tracking-wide border-[#F5F5F5] px-[9px] py-[7px] bg-transparent text-red-500 cursor-pointer"
        onClick={handleDelete}
      >
        Delete
      </p>
    </div>
   );
}
 
export default Sections;