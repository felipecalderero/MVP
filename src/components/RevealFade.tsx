'use client'
import { motion, useAnimation, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { fadeIn, slideAnimation } from "../framer/motion.jsx";

import React from "react";

const RevealFade = ({children, direction, delay, customClass, hold}:{children: React.ReactNode; direction:string; delay:number; customClass?:string; hold?:number}) => {
  
  const controls = useAnimation();
  const { ref, inView } = useInView({
    triggerOnce: true, // Change to false if you want the animation to trigger again whenever it comes in view
    threshold: hold || 0
  });

  React.useEffect(() => {
    if (inView) {
      controls.start("show");
    }
  }, [controls, inView]);
  
  return ( 
      <div className="w-full">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={fadeIn(direction, delay)}
          className={customClass}
        >
          {children}
        </motion.div>
      </div>
   );
}
 
export default RevealFade;