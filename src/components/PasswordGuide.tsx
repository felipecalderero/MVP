'use client'

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";


const validPassword =  /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
const passSpecialCharacters = /^(?=.*[!@#$%^&*])/;
const passLowerCaseLetters = /^(?=.*[a-z])/;
const passUpperCaseLetters = /^(?=.*[A-Z])/;
const passNumber = /^(?=.*[0-9])/;


const PasswordGuide = ({password, setValidPassword1}:{password:string; setValidPassword1: Dispatch<SetStateAction<boolean>>}) => {

  const [passSpecialCharactersState, setPassSpecialCharactersState] = useState<boolean>(false);
  const [passLowerCaseLettersState, setPassLowerCaseLettersState] = useState<boolean>(false);
  const [passUpperCaseLettersState, setPassUpperCaseLettersState] = useState<boolean>(false);
  const [passNumberState, setPassNumberState] = useState<boolean>(false);
  const [passLengthState, setPassLengthState] = useState<boolean>(false);

  useEffect(() => {
    
    // PASSWORD COMPLETE MATCH
    if(validPassword.test(password)){
      setValidPassword1(true);
    }else{
      setValidPassword1(false);
    };

    // EACH REGEX
    if(passSpecialCharacters.test(password)){
      setPassSpecialCharactersState(true);
    }else{
      setPassSpecialCharactersState(false);
    };

    if(passLowerCaseLetters.test(password)){
      setPassLowerCaseLettersState(true);
    }else{
      setPassLowerCaseLettersState(false);
    };

    if(passUpperCaseLetters.test(password)){
      setPassUpperCaseLettersState(true);
    }else{
      setPassUpperCaseLettersState(false);
    };

    if(passNumber.test(password)){
      setPassNumberState(true);
    }else{
      setPassNumberState(false);
    };

    if(password.length > 8){
      setPassLengthState(true);
    }else{
      setPassLengthState(false);
    };
    
  }, [password]);

  return ( 
    <div className='flex flex-col items-start justify-start gap-y-2'>
        <span className="myFlex justify-start gap-x-1 poppins text-[13px] tracking-wide">
          {
            passLengthState ? (
              <FaCircleCheck className="text-success"/>
              ):(
              <FaCircleCheck className="text-gray-400"/>
            )
          }
          At least 8 characters
        </span>

        <span className="myFlex justify-start gap-x-1 poppins text-[13px] tracking-wide">
          {
            passNumberState ? (
              <FaCircleCheck className="text-success"/>
              ):(
              <FaCircleCheck className="text-gray-400"/>
            )
          }
          At least 1 number
        </span>

        <span className="myFlex justify-start gap-x-1 poppins text-[13px] tracking-wide">
          {
            passUpperCaseLettersState ? (
              <FaCircleCheck className="text-success"/>
              ):(
              <FaCircleCheck className="text-gray-400"/>
            )
          }
          At least 1 capital letter
        </span>

        <span className="myFlex justify-start gap-x-1 poppins text-[13px] tracking-wide">
          {
            passLowerCaseLettersState ? (
              <FaCircleCheck className="text-success"/>
              ):(
              <FaCircleCheck className="text-gray-400"/>
            )
          }
          At least 1 lowercase letter
        </span>

        <span className="myFlex justify-start gap-x-1 poppins text-[13px] tracking-wide">
          {
            passSpecialCharactersState ? (
              <FaCircleCheck className="text-success"/>
              ):(
              <FaCircleCheck className="text-gray-400"/>
            )
          }
          At least 1 special character
        </span>
      </div>
   );
}
 
export default PasswordGuide;