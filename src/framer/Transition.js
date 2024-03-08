/* eslint-disable react/display-name */
'use client'
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";


const transition = (OgComponent) => {

  
  
  return () => {
    
    return (
      <AnimatePresence mode="wait" key={router.pathname}>
          <OgComponent/>
          <motion.div
            className="fixed top-0 z-[1000] left-0 w-[100%] h-screen bg-[#1f1f1f] origin-bottom"
            initial={{scaleY: 0}}
            animate={{scaleY: 1}}
            exit={{scaleY: 0}}
            transition={{duration: 1, ease: [0.22, 1, 0.36, 1]}}
          ></motion.div>
          <motion.div
            className="fixed top-0 z-[1000] left-0 w-[100%] h-screen bg-[#1f1f1f] origin-top"
            initial={{scaleY: 1}}
            animate={{scaleY: 0}}
            exit={{scaleY: 1}}
            transition={{duration: 1, ease: [0.22, 1, 0.36, 1]}}
          ></motion.div>
      </AnimatePresence>
    )
  }
};

export default transition;



/*
<>
    {renderColor[colorKey].map((color, index) => {
      const delay = index === 0 ? 0.2 : index === 1 ? 0.4 : 0.6;
      const zIndex = index === 0 ? "z-50" : index === 1 ? "z-40" : "z-30";
      return(
        <motion.div
          key={index}
          className={`fixed top-0 bottom-0 right-full w-screen h-screen ${zIndex} ${color}`}
          variants={transitionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{delay, duration: 0.6, ease:'easeInOut'}}
        ></motion.div>
      )
    })}
    </>
*/



