'use client'

import Sections from "@/components/AccountSections";
import Footer from "@/components/Footer";
import { Avatar, Input } from "@nextui-org/react";
import { onAuthStateChanged } from "firebase/auth";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { FaTrash } from "react-icons/fa";
import {db, auth as getAuth} from "../../../firebase.js";
import {User as FirebaseUser} from "firebase/auth";
import { Router } from "next/router.js";
import { useRouter } from "next/navigation";
import SignIn from "../sign_in/page";
import { useFirebaseUser } from "@/store/store";
import { doc, updateDoc } from "firebase/firestore";
import { RiLoader5Fill } from "react-icons/ri";
import { toast } from "sonner";
import uniqid from 'uniqid';
import withAuth from "@/components/WithAuth.js";
import { Helmet } from "react-helmet";


const initialForm = {
  displayName:"",
  profession:""
}

const Account = () => {

  const uploadRef = useRef<HTMLInputElement | null>(null)
  const [user] = useFirebaseUser(state => [state.user]);
  const router = useRouter();

  const [form, setForm] = useState(initialForm);
  const [updating, setUpdating] = useState<boolean>(false);
  const [updatingImage, setUpdatingImage] = useState<boolean>(false);
  const [removingImage, setRemovingImage] = useState<boolean>(false);
  const [allow, setAllow] = useState<boolean>(false);

  const handleUpdate = () =>{
    if(!form.displayName.length || !form.profession.length){
      toast.warning("We're sorry", {
        description: `It can't be empty fields.`,
        duration: 3000,
        closeButton: true,
      })
    }
    if(form.displayName.length && form.profession.length && user){
      setUpdating(true);

      const userRef = doc(db, "Users", user?.uid!)
      updateDoc(userRef, {
        displayName: form.displayName,
        profession: form.profession
      })
      .then(()=>{
        toast.success("Information updated!", {
          description: `${new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}`,
          duration: 3000,
        })
      })
      .catch(error => {
        toast.error("We're sorry", {
          description: `Something went wrong updating your information, please try again later.`,
          duration: 3000,
          closeButton: true,
        })
      })
      .finally(()=> {
        setUpdating(false)
      })
    };
  };

  const handleUpload = async(e:ChangeEvent<HTMLInputElement>) =>{
    if(user){
      const file = e.target.files;
      if(file && file.length > 0){
        
        const fileName = file[0].name.replaceAll(" ", "").toLowerCase() + uniqid(); 
        const fileType = file[0].type;
        if(fileType !== "image/png" && fileType !== "image/jpg" && fileType !== "image/svg+xml"){
          return toast.warning("We're sorry", {
            description: `Only SVG, PNG & JPEG formats are accepted!`,
            duration: 3000,
            closeButton: true,
          })
        };  
        

        const binaryFile = await file[0].arrayBuffer();
        const fileBuffer = Buffer.from(binaryFile);
        
        setUpdatingImage(true);

        fetch("/api/uploadS3", {
          method:"POST",
          headers:{
            "Content-type":"application/json"
          },
          body:JSON.stringify({
            fileType,
            fileName,
            fileBuffer
          })
        })
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(json => {
          if(json.success){
            // If image uploads to AWS, we update user image.
            const userRef = doc(db, "Users", user.uid!);
            updateDoc(userRef, {
              image:`https://d2b099b4jqara7.cloudfront.net/${fileName}`
            })
            .then(()=> {
              toast.success("Profile picture updated!", {
                description: `${new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}`,
                duration: 3000,
                closeButton: true,
              })
            })
            .catch(error => {
              toast.warning("Whoops!", {
                description: `Something went wrong, please try again later. Remember only SVG, PNG & JPEG formats are accepted!`,
                duration: 3000,
                closeButton: true,
              })
            })
          }else{

          }
        })
        // If image is not uploaded to AWS, throw error.
        .catch(error => {
          toast.warning("Whoops!", {
            description: `Something went wrong, please try again later.`,
            duration: 3000,
            closeButton: true,
          })
        })
        .finally(()=> {
          setUpdatingImage(false);
        })
  
      };  
    }
  };

  const handleRemoveImage = () =>{
    if(user){
      setRemovingImage(true);

      const userRef = doc(db, "Users", user.uid!);
      updateDoc(userRef, {
        image: ""
      })
      .then(()=> {
        toast.success("Profile picture removed!", {
          description: `${new Date().toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}`,
          duration: 3000,
          closeButton: true,
        })
      })

      .catch(error => {
        toast.success("We're sorry", {
          description: `Something went wrong removing your profile picture, please try again later.`,
          duration: 3000,
          closeButton: true,
        })
      })
      .finally(()=>{
        setRemovingImage(false);
      })
    }
  };

  useEffect(() => {
    if(user){
      setForm({
        displayName: user.displayName!,
        profession: user.profession!
      })
    }
  }, [user]);

  useEffect(() => {
    const sessionExist = localStorage?.getItem("mmw-user");
    if(!sessionExist){
      router.push("/")
    }else{
      setAllow(true);
    };
  }, []);

  if(allow){
    return ( 
      <div className="min-h-screen overflow-hidden flex flex-col items-start justify-center lato pt-[120px]">
        
        <Helmet title="Account | MMW"/>
  
        {/* Main */}
        <div className="flex items-center justify-start flex-col myContainer mx-auto flex-1 w-full pb-[40px]">
          {/* Title */}
          {/* <div className="flex items-center justify-start w-full">
            <h2 className="font-semibold text-[42px] tracking-wide pb-8">My Dashboard</h2>
          </div> */}
  
  
          <div className="flex flex-col md-xl:flex-row items-center md-xl:items-start justify-between w-full">
            {/* Sections */}
              <Sections/>
  
            {/* Form & Image upload */}
            <div className="h-full w-full flex items-start justify-start flex-col bg-white rounded-tr-2xl rounded-br-2xl p-4 md-xl:p-14 pt-0">
              <h2 className="poppins text-2xl font-semibold tracking-wide mb-2">My Profile</h2>
              <span className="text-gray-500 text-[13px] poppins">Manage your personal information.</span>
  
              <p className="mt-16 mb-4 poppins tracking-wide text-lg font-semibold">Change profile picture</p>
              
              {/* Profile Pic */}
              <div className="flex flex-col gap-y-5 md-xl:flex-row items-start justify-start md-xl:items-center md-xl:justify-between w-full">
                {/* Left */}
                <div className="flex items-start justify-start flex-col gap-y-6 w-[50%]">
                  {/* Photo & Buttons */}
                  <div className="flex items-center justify-start gap-x-10">
                    <Avatar isBordered className='w-24 h-24' src={user?.image || ""} />
                    {/* Buttons */}
                    <div className="myFlex flex-col gap-y-2">
                      <input onChange={handleUpload} ref={uploadRef} className="absolute top-0 left-0 opacity-0 invisible" type="file" name="my-file" />
                      <button 
                        className="bg-[#27333E] myFlex w-[130px] h-[40px] rounded-md text-white poppins text-[12px] tracking-wide"
                        onClick={()=> uploadRef?.current?.click()}
                      >
                        {updatingImage ? (
                          <RiLoader5Fill className="w-5 h-5 animate-spin text-white"/>
                        ):(
                          "Change Picture"
                        )}
                      </button>
                      <button 
                        className="myFlex gap-x-2 text-blacky font-medium w-[130px] h-[40px] rounded-md poppins tracking-wide text-[12px] border-[1.5px] border-[#a1a1a15d]"
                        onClick={()=> {
                          toast.warning("Are you sure?", {
                            description: `Your profile picture will be permanenty deleted.`,
                            action: {
                              label:"Yes",
                              onClick: handleRemoveImage
                            },
                            closeButton: true,
                          })
                        }}
                      >
                        {removingImage ? (
                          <RiLoader5Fill className="w-5 h-5 animate-spin text-black"/>
                        ):(
                          <>
                            <FaTrash className="w-4 h-4 text-red-500"/>
                            Remove
                          </>
                        )}
                      </button>
                    </div>
                  </div>
  
                  {/* Text */}
                  <p className="poppins text-xs tracking-wide text-gray-500 leading-5">Choose your favorite picture! Recommended size is 260x260.</p>
                </div>
  
                {/* Right */}
                <div className="relative xs:w-[80%] sm:w-[70%] md:w-[65%] md-xl:w-[50%] flex items-start justify-start bg-gray-300/20 p-5 rounded-md">
                  {/* Text */}
                  <div className="h-full w-[60%]">
                    <p className="poppins tracking-wide font-semibold text-[15px] mb-2">Pick a good one!</p>
                    <p className="poppins text-gray-500 text-[13px] leading-6">
                      {"Hey Superstar! It's time to put your best face forward because your profile picture is the VIP of the digital show!"}
                    </p>
                  </div>
  
                  {/* Image */}
                  <div className="absolute top-1/2 -translate-y-1/2 -right-10">
                    <img src="/images/Selfie.svg" alt="" className="w-[170px]"/>
                  </div>
                </div>
              </div>
  
              {/* Inputs */}
              <div className="mt-14 flex items-start justify-start flex-col gap-y-5 w-[80%] md-xl:w-[60%]">
                <div className="w-full">
                  <Input
                    fullWidth
                    label="Full Name"
                    placeholder="…"
                    value={form.displayName}
                    onValueChange={(e)=> setForm({...form, displayName: e})}
                  />
                </div>
                <div className="w-full">
                  <Input
                    fullWidth
                    label="Profession"
                    placeholder="…"
                    value={form.profession}
                    onValueChange={(e)=> setForm({...form, profession: e})}
                  />
                </div>
                <button 
                  className="mt-3 myFlex bg-[#DC4E27] text-white poppins text-[12px] w-[100.13px] h-[38px] rounded-md"
                  onClick={handleUpdate}
                >
                  {updating ? (
                    <RiLoader5Fill className="text-white w-4 h-4 animate-spin"/>
                  ):(
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
  
          </div>
  
        </div>
  
        {/* Footer */}
        <div className="w-full">
          <Footer/>
        </div>
      </div>
     );
  }
}
 
export default Account;


