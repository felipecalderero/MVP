'use client'
import { motion, useAnimation, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";

import React from "react";

const Reveal = ({children, animation, customClass, hold}:{children: React.ReactNode; animation: Variants; customClass?:string; hold?:number}) => {
  
  const controls = useAnimation();
  const { ref, inView } = useInView({
    triggerOnce: true, // Change to false if you want the animation to trigger again whenever it comes in view
    threshold: hold || 0,
  });

  React.useEffect(() => {
    if (inView) {
      controls.start("animate");
    }
  }, [controls, inView]);
  
  return ( 
      <div className="w-full">
        <motion.div
          ref={ref}
          initial="initial"
          animate={controls}
          exit="exit"
          variants={animation}
          className={customClass}
        >
          {children}
        </motion.div>
      </div>
   );
}
 
export default Reveal;