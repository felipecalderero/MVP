/* eslint-disable react/display-name */
import SignIn from "@/app/sign_in/page";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const withNoAuth = (Component) => {
  return () => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem('mmw-user');

      if(token) {
        router.push("/");
      }else{
        return <Component />;
      
      }
    }, []);

  };
};

export default withNoAuth;