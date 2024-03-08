'use client'

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, User} from "@nextui-org/react";
import { IoCaretDownSharp } from "react-icons/io5";
import MainPanel from "@/modals/MainPanelModal";
import { onAuthStateChanged, signOut } from "firebase/auth";
import firebase from "firebase/app"
import { useFirebaseUser } from "@/store/store";
import { AiOutlineLoading } from "react-icons/ai";
import { auth, db } from "../../firebase";
import { collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";


const Header = () => {

  const [user, setUser] = useFirebaseUser(state => [state.user, state.setUser]);
  const router = useRouter();
  const name = "Subhi I";
  const pathname = usePathname();
  const [fixed, setFixed] = useState(false);

  const [openMenu, setOpenMenu] = useState<boolean>(false);

  const handleScroll = () =>{
    if (window.scrollY > 0) {
      setFixed(true);
    } else {
      setFixed(false);
    }
  };

  const mySignOut = () =>{
    signOut(auth).then(()=> {
      setUser(null);
      localStorage.removeItem("mmw-user");
      router.push("/");
    });
  };

  useEffect(() => {
    if(window !== undefined){
      if(pathname === "/"){
        window.addEventListener("scroll", handleScroll);
  
        return ()=> {
          window.removeEventListener("scroll", handleScroll);
        }
      }else{
        setFixed(true);
      }
    }
  }, []);

  useEffect(() => {
    if(openMenu){
      document.documentElement.style.overflowY = "hidden";
    }else{
      document.documentElement.style.overflowY = "auto";
    }
  }, [openMenu]);



  return ( 
    <header className={`${pathname?.includes("/course/") && "hidden"} fixed top-0 left-0 z-40 w-full myFlex h-[70px] bg-[#134731] text-white source-sans`}>
      {/* SidePanel */}
      <MainPanel openMenu={openMenu} setOpenMenu={setOpenMenu}/>

      <div className="flex items-center justify-between w-full myContainer">
        <img src="/images/Logo2.svg" alt="e" className="w-fit cursor-pointer" onClick={()=> router.push("/")}/>

        {/* Links */}
        {(user === null || user === undefined) ? (
          <div className="hidden sm:myFlex gap-x-8 text-[12px] font-light tracking-wider">
            <Link href="/collections">ALL COURSES</Link>
            {user === undefined ? (
              <AiOutlineLoading className="animate-spin text-white w-5 h-5"/>
            ):(
              <Link href="/sign_in">SIGN IN</Link>
            )}
          </div>
        ):(
          <div className="hidden sm:myFlex gap-x-8 text-[12.5px] font-light tracking-wider">
            <Link href="/collections">ALL COURSES</Link>
            <Link href="/enrollments">MY DASHBOARD</Link>
            {/* User Dropdown */}
            <Dropdown 
              placement="bottom-end"
              classNames={{
                base: "",
              }}
              className="lato"
            >
              <DropdownTrigger>
                <div className="myFlex gap-x-2 cursor-pointer">
                  {/* <span className="uppercase">{name}</span> */}
                  {/* <img src="https://www.rainmaking.courses/assets/tenant/defaults/avatar.png" alt="" className="w-[28px] h-[28px]" /> */}
                  <Avatar
                    isBordered
                    as="button"
                    className="transition-transform w-7 h-7"
                    src={user.image || ""}
                    // TODO: Add Fallback URL, in DOCS
                  />
                  {/* <IoCaretDownSharp className="-ml-1 w-[9px] h-[9px]"/> */}
                </div>
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold text-[#DC4E27]">{user.displayName?.length! > 26 ? user.displayName?.slice(0, 25) + "…" : user.displayName}</p>
                </DropdownItem>
                <DropdownItem key="myaccount">
                  <Link href="/account">
                    My Account
                  </Link>
                </DropdownItem>
                <DropdownItem key="support">
                  <a href='mailto:subhi@millennialmentalwellbeing.org?subject=Contact%20MMW&body=Hi%20there!%20Send%20us%20a%20message%20and%20our%20team%20will%20get%20back%20to%20you%20soon.'>
                    Support
                  </a>
                </DropdownItem>
                <DropdownItem key="signout" color="danger" onClick={mySignOut}>
                  Sign Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        )}

        {/* -SM Links */}
        <div className="sm:hidden absolute top-3 right-0 z-50 cursor-pointer">
          {/* Hamburguer */}
          <div>
            <button className="relative group">
              <div className="relative flex overflow-hidden items-center justify-center rounded-full w-[50px] h-[50px] transform transition-all">
                <div className="flex flex-col justify-between w-[20px] h-[12px] transform transition-all duration-300 origin-center overflow-hidden" onClick={()=> setOpenMenu(!openMenu)}>
                  <div className={`bg-white h-[1.8px] rounded w-[17px] transform transition-all duration-300 origin-left ${openMenu && "translate-x-10"}`}></div>
                  <div className={`bg-white h-[1.8px] rounded w-[17px] transform transition-all duration-300 ${openMenu && "translate-x-10"} delay-75`}></div>
                  <div className={`bg-white h-[1.8px] rounded w-[17px] transform transition-all duration-300 origin-left ${openMenu && "translate-x-10"} delay-150`}></div>

                  <div className={`absolute items-center justify-between transform transition-all duration-500 top-1.5 -translate-x-10 ${openMenu && "translate-x-0"} flex w-0 ${openMenu && ""}w-12`}>
                    <div className={`absolute bg-white h-[1.5px] w-4 transform transition-all duration-500 rotate-0 delay-300 ${openMenu && "rotate-45"}`}></div>
                    <div className={`absolute bg-white h-[1.5px] w-4 transform transition-all duration-500 -rotate-0 delay-300 ${openMenu && "-rotate-45"}`}></div>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

      </div>
    </header>
   );
}
 
export default Header;