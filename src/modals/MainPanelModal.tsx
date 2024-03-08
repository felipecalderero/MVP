'use client'

import ParticlesContainer from "@/components/ParticlesContainer";
import Link from "next/link";
import { FaAngleDown } from "react-icons/fa";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, User} from "@nextui-org/react";
import { useFirebaseUser } from "@/store/store";
import { getAuth, signOut } from "firebase/auth";
import { Dispatch, SetStateAction } from "react";
import { redirect, useRouter } from "next/navigation";


const MainPanel = ({openMenu, setOpenMenu}:{openMenu: boolean; setOpenMenu:Dispatch<SetStateAction<boolean>>}) => {

  // const logged = true;
  const [user, setUser] = useFirebaseUser(state => [state.user, state.setUser]);
  

  const auth = getAuth();
  const router = useRouter();

  const handleLink = (path:string) =>{
    setOpenMenu(false);
    router.push(path);
  };

  const mySignOut = () =>{
    signOut(auth).then(()=> {
      setUser(null);
      localStorage.removeItem("mmw-user");
      setOpenMenu(false);
      router.push("/");
    })
  };

  return ( 
    <nav className={`fixed bottom-0 left-0 h-[calc(100vh-70px)] w-full flex sm:hidden items-end justify-end bg-transparent z-40 transition-all duration-300 ${openMenu ? 'translate-x-0' : "-translate-x-[120%]"}`}>
      <div className="relative w-full h-full bg-[#134731] myFlex flex-col gap-y-10 text-white font-bold text-2xl min-phone:text-3xl tracking-wide">
        {/* Particles */}
        <div className="absolute z-10 left-0 bottom-0 w-[100vw] h-full">
          <ParticlesContainer/>
        </div>

        {/* User Bottom Icon */}
        {user && (
          <div 
            className="absolute bottom-4 left-4 w-fit cursor-pointer"
          >
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  size="sm"
                  isBordered
                  as="button"
                  className="transition-transform"
                  src={user.image || ""}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold text-[#DC4E27]">{user.displayName}</p>
                </DropdownItem>
                <DropdownItem key="myaccount">
                  <span className="cursor-pointer w-full" onClick={()=> handleLink("/account")}>
                    My Account
                  </span>
                </DropdownItem>
                <DropdownItem key="support">
                  <a className="w-full" href='mailto:subhi@millennialmentalwellbeing.org?subject=Contact%20MMW&body=Hi%20there!%20Send%20us%20a%20message%20and%20our%20team%20will%20get%20back%20to%20you%20soon.'>
                    Support
                  </a>
                </DropdownItem>
                <DropdownItem className="w-full" key="signout" color="danger" onClick={mySignOut}>
                  Sign Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        )}
        
        {/* Links */}
        {user ? (
          <>
            <span onClick={()=> handleLink("/collections")} className="cursor-pointer transtion-opacity duration-300 hover:opacity-80 z-20">All Courses</span>
            <span onClick={()=> handleLink("/enrollments")} className="cursor-pointer transtion-opacity duration-300 hover:opacity-80 z-20">My Dashboard</span>
          </>
        ):(
          <>
            <span onClick={()=> handleLink("/collections")} className="cursor-pointer transtion-opacity duration-300 hover:opacity-80 z-20">All Courses</span>
            <span onClick={()=> handleLink("/sign_in")} className="cursor-pointer transtion-opacity duration-300 hover:opacity-80 z-20">Sign In</span>
          </>
        )}

        
      </div>
    </nav>
   );
}
 
export default MainPanel;