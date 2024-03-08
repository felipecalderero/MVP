'use client'

import Footer from "@/components/Footer";
import { GoogleAuthProvider, GithubAuthProvider, OAuthProvider, signInWithPopup, AuthProvider, signInWithEmailAndPassword, getAdditionalUserInfo } from "firebase/auth";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { auth, db } from "../../../firebase";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { AiFillGithub, AiOutlineLoading } from "react-icons/ai";
import { useFirebaseUser } from "@/store/store";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { useCollection } from 'react-firebase-hooks/firestore';
import { FaEye, FaEyeSlash, FaGithub } from "react-icons/fa";
import ForgotModal from "@/modals/ForgotPassword";
import { toast } from "sonner";
import {Helmet} from "react-helmet"

const errors = [
  {
    title:"Firebase: Error (auth/invalid-credential).",
    render:"Invalid credential. Make sure your email is asssociated with an account, if so, make sure your password is correct."
  },
  {
    title:"Firebase: Error (auth/invalid-email).",
    render:"Invalid email."
  }
]

const SignIn = () => {

  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null)

  const router = useRouter();
  const [setUser] = useFirebaseUser(state => [state.setUser]);

  
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [validating, setValidating] = useState<boolean>(false);
  const [forgotOpen, setForgotOpen] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [allow, setAllow] = useState<boolean | null>(null);

  const GoogleProvider = new GoogleAuthProvider();
  const GithubProvider = new GithubAuthProvider();
  const MicrosoftProvider = new OAuthProvider('microsoft.com');
  
  const [Users, loading, error] = useCollection(
    collection(db, "Users"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  
  const handleLogin = (provider: AuthProvider) => {
    signInWithPopup(auth, provider)
      .then((result) => {
        
        const user = result.user;
        const provider = user.providerData[0].providerId;
        let microsoftEmail: any = "";
        const sessionExist = localStorage.getItem("mmw-user");

        if(!sessionExist){
          localStorage.setItem("mmw-user", JSON.stringify(user));
        };


        if(provider === "microsoft.com"){
          microsoftEmail = getAdditionalUserInfo(result)?.profile?.mail;
        };

        const email = user.email;
        const customUser = {
          displayName: user.displayName,
          image: user.photoURL || "",
          email: microsoftEmail ? microsoftEmail : user.email,
          uid: user.uid,
          courses: [],
          favorites: [],
          profession: "",
          provider: user.providerData[0].providerId
        }


        let validateUserExist = null;
        Users?.docs.map((doc)=> {          
          if(doc.data().provider === provider && doc.data().uid === user.uid!){
            validateUserExist = doc.data();
          }
        });

        // If null, the user is new, if not we initiate session.
        if(!validateUserExist){
          setDoc(doc(db, "Users", user.uid), customUser).
          then(() => {
            setUser(customUser)
            toast.success("Successfully signed in!", {
              description: `${new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}`,
              duration: 3000,
              closeButton: true
            })
            setTimeout(()=>{
              router.push("/");
            },3000);
          }).
          catch(error => console.log(error))
        }else{
          setUser(validateUserExist)
          toast.success("Successfully signed in!", {
            description: `${new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}`,
            duration: 3000,
            closeButton: true
          })
          setTimeout(()=>{
            router.push("/");
          },3000);
        }
        
      }).catch((error) => {
        // Handle Errors here.
        console.log(error);
        throw new Error(error)
        
      });
  }

  const signIn = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!emailRef.current?.value || !passwordRef.current?.value){
      toast.error("Please try again", {
        description: `You must complete all fields.`,
        duration: 3000,
        closeButton: true
      })
    };
    if(emailRef.current?.value && passwordRef.current?.value){
      setValidating(true);
      signInWithEmailAndPassword(
        auth,
        emailRef.current!.value,
        passwordRef.current!.value
      )
      .then((userCredential) => {
        // Signed in 
        // Put in localhost
        const user = userCredential.user;
        const provider = user.providerData[0].providerId;
        const email = user.email;
        const sessionExist = localStorage.getItem("mmw-user");

        if(!sessionExist){
          localStorage.setItem("mmw-user", JSON.stringify(user));
        };
        
        Users?.docs.map((doc)=> {          
          if(doc.data().provider === provider && doc.data().uid === user.uid!){
            const userFound = doc.data()[0];
            setUser(userFound);  
            toast.success("Successfully signed in!", {
              description: `${new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}`,
              duration: 3000,
              closeButton: true
            })
            setTimeout(()=>{
              router.push("/");
            },3000);
          }
        });
        
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        
        errors.map(error =>{
          if(error.title === errorMessage){
            toast.error("Please try again.", {
              description: error.render,
              duration: 3000,
              closeButton: true
            })
          }
        })
      })
      .finally(()=> setValidating(false));
    };
  };

  useEffect(() => {
    const sessionExist = localStorage?.getItem("mmw-user");
    if(sessionExist){
      router.push("/")
    }else{
      setAllow(true);
    };
  }, []);
 
 
  if(allow){
    return ( 
      <div className="relative min-h-screen flex flex-col items-start justify-center bg-[#f9f9f9] lato pt-[110px]">
        <Helmet title="Sign In | MMW"/>

        {/* Forgot Password Modal */}
        {forgotOpen && <ForgotModal setOpen={setForgotOpen}/>}
        {/* Shapes */}
        <div className="absolute bottom-5 -left-10 w-full z-20">
          <img src="/images/CircleShape.svg" alt="" className="w-[180px] xs:w-[200px] xl:w-[250px] opacity-90"/>
        </div>
        <div className="absolute top-10 right-10 z-20 -rotate-[45deg]">
          <img src="/images/LampShape.svg" alt="" className="xs-[250px] xs:w-[300px] xl:w-[400px]"/>
        </div>
        <div className="hidden xs:block absolute top-16 left-0 z-20">
          <img src="/images/WeirdShape.svg" alt="" className="w-[130px] xs:w-[180px] xl:w-[230px]"/>
        </div>
        <div className="absolute bottom-20 right-1 z-20">
          <img src="/images/WeirdShape2.svg" alt="" className="w-[130px] xs:w-[180px] xl:w-[230px]"/>
        </div>
        {/* Main */}
        <div className="myFlex flex-col myContainer mx-auto flex-1">
          {/* Title */}
          <h2 className="z-30 text-[32px] min-phone:text-[42px] font-semibold pb-5">Welcome Back!</h2>


          {/* Form */}
          <form onSubmit={signIn} className="w-full phone:w-[400px] bg-white p-3 phone:p-6 shadow-sm rounded-md lg:w-[470px] myFlex flex-col gap-y-4 z-30">
            {/* Email */}
            <div className="w-full">
              <span className="text-[11px] font-semibold">Email</span>
              <input 
                ref={emailRef}
                type="text" 
                placeholder="Email"
                className="bg-[#f5f5f5] w-full mt-[0.5px] px-3 border-[0.7px] border-transparent transition-all duration-300 h-[35px] flex flex-1 text-[13px] tracking-wide placeholder:text-[#585957] placeholder:opacity-80  focus:border-[#DC4E27] focus:outline-none hover:border-[#DC4E27]" 
              />
            </div>

            {/* Password */}
            <div className="w-full">
              <span className="text-[11px] font-semibold">Password</span>
              <div className="w-full relative">
                <input 
                  ref={passwordRef}
                  type={`${showPassword ? "text" : "password"}`} 
                  placeholder="Password"
                  className="bg-[#f5f5f5] w-full mt-[0.5px] px-3 border-[0.7px] border-transparent transition-all duration-300 h-[35px] flex flex-1 text-[13px] tracking-wide placeholder:text-[#585957] placeholder:opacity-80  focus:border-[#DC4E27] focus:outline-none hover:border-[#DC4E27]" 
                />
                {/* Show password */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  {showPassword ? (
                    <FaEyeSlash className="mt-[0.5px] w-3.5 h-3.5 cursor-pointer" onClick={()=> setShowPassword(!showPassword)}/>
                  ):(
                    <FaEye className="mt-[0.5px] w-3.5 h-3.5 cursor-pointer" onClick={()=> setShowPassword(!showPassword)}/>
                  )}
                </div>
              </div>
            </div>

            {/* Remember me & Forgot Password */}
            <div className="w-full flex items-center justify-between mt-1">
              <div className="myFlex gap-x-1.5">
                <input type="checkbox" id="rememberMe" className="w-[10px]" />
                <label htmlFor="rememberMe" className="text-[11px] font-semibold">Remember me</label>
              </div>
              <span onClick={()=> setForgotOpen(true)} className="cursor-pointer text-[#585957] text-[11px] myUnderline underline decoration-[#585957]">
                Forgot Password?
              </span>
            </div>


            {/* Sign In */}
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center justify-start w-full mt-1">
                <button 
                  className="myFlex bg-[#DC4E27] text-[13px] tracking-wider text-white border-[1.5px] border-[#DC4E27] rounded-full w-[76.71px] h-[35.3px]"
                >
                  {validating ? (<AiOutlineLoading className="animate-spin w-4 h-4 text-white"/>):("Sign in")}
                </button>
              </div>
              <div className="flex items-center justify-end w-full gap-x-2">
                <FcGoogle className="w-6 h-6 cursor-pointer" onClick={()=> handleLogin(GoogleProvider)}/>
                <AiFillGithub className="w-6 h-6 cursor-pointer" onClick={()=> handleLogin(GithubProvider)}/>
                <img src="/images/MicrosoftIcon.svg" alt="" className="w-[27px] h-[27px] cursor-pointer" onClick={()=> handleLogin(MicrosoftProvider)}/>
              </div>
            </div>
          </form>


          {/* Create a new account */}
          <div className="flex items-start justify-start w-full phone:w-[400px] lg:w-[470px] ml-1 text-[13px] mt-12 z-30 pb-5 phone:pb-0">
            <div className="w-full h-full">
              {"Don't have an account? Don't worry,"}&nbsp;
              <Link href="/sign_up" className="text-[#DC4E27]">
                click here.
              </Link>
            </div>
          </div>
        </div>


        {/* Footer */}
        <div className="w-full z-30">
          <Footer/>
        </div>
      </div>
    );
  };
}
 
export default SignIn;