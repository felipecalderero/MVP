'use client'

import { slideAnimation } from '@/framer/motion';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { Dispatch, SetStateAction, useEffect } from 'react';

const MyToast = ({setOpen, title, text, autoClose, button, btnText, btnLink}:{setOpen:Dispatch<SetStateAction<boolean>>; title:string; text:string; autoClose?:boolean; button?:boolean, btnText:string; btnLink:string}) => {
  
  useEffect(() => {
    if(autoClose){
      setTimeout(()=>{
        setOpen(false);
      },3000);
    }
  }, [autoClose]);
  
  return ( 
    <AnimatePresence mode='wait'>
      <motion.div 
        key="MyToast"
        {...slideAnimation("right")} 
        className="fixed z-30 rounded-md bottom-3 right-3 py-3.5 px-5 bg-[#27333E] border-[4px] border-[#364452] flex flex-col items-start justify-start text-white source-sans coursor-pointer"
        onClick={()=> setOpen(false)}
      >
        <p className='text-[15px] font-semibold'>{title}</p>
        <p className='text-[13px] tracking-wide leading-6'>{text}</p>
        {button && (
          <button 
            onClick={(e)=> e.stopPropagation()} 
            className='mt-5 px-3 py-1 rounded-sm text-[13px] border-none bg-white text-[#1f1f1f] font-semibold'
          >
            <Link href={btnLink}>
              {btnText}
            </Link>
          </button>
        )}
      </motion.div>
    </AnimatePresence>
   );
}
 
export default MyToast;