import { Progress } from "@nextui-org/react";
import Link from "next/link";
import { FaCaretDown } from "react-icons/fa";
import {Accordion, AccordionItem} from "@nextui-org/react";
import { FaCircleCheck, FaRegCircleCheck } from "react-icons/fa6";
import { FaAngleDown } from "react-icons/fa6";
import { IoVideocamOutline } from "react-icons/io5";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { GoChecklist } from "react-icons/go";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { List, SectionObjectFormat, Step, UserCourse } from "../../typings";
import { IoIosCheckmarkCircle, IoIosCheckmarkCircleOutline } from "react-icons/io";
import { toast } from "sonner";



const PanelModal = ({course, open, setOpen, section, setSection, selectedKeys, setSelectedKeys}:{course: UserCourse | null; open:boolean; setOpen:Dispatch<SetStateAction<boolean>>, section:SectionObjectFormat | null, setSection:Dispatch<SetStateAction<SectionObjectFormat | null>>, selectedKeys:Set<string>, setSelectedKeys:any}) => {

  const [openDrop, setOpenDrop] = useState(false);
  const [input, setInput] = useState<string>("");
  const [results, setResults] = useState<any>(null);

  const handleSection = (each:List, stepTitle: string) =>{
      setSection({
        stepTitle: stepTitle,
        substep: each
      });
      setOpen(false);
  };


  useEffect(() => {
    if(course){
      if(input.length >= 3){
        let foundResults:any = [];

        // Map steps
        course.steps.map((step: Step) => {
          let foundSubsteps:any = [];

          // Map step list
          step.list.map((substep: List)=>{
            if(substep.name.toLowerCase().includes(input.toLowerCase())){
              foundSubsteps.push(substep);
            }
          });

          if(foundSubsteps.length){
            foundResults.push({
              title: step.title,
              list: foundSubsteps
            })
          };

          setResults(foundResults)
        })
      }else{
        setResults(null);
      }
    };
  }, [input, course]);
  
  return ( 
    <article className={`lg:hidden fixed top-0 left-0 flex items-start justify-start min-h-screen h-full w-full overflow-hidden bg-black/30 mt-[51px] source-sans transition-opacity duration-100 ${open ? "opacity-100 visible z-40" : "opacity-0 invisible z-0"}`}>
      <div className={`w-full sm:w-[350px] h-full bg-[#F2F3F5] overflow-y-auto transition-all duration-300 ${open ? "translate-x-0" : "-translate-x-[120%]"}`}>
        {/* Intro */}
        <div className="flex items-start justify-center flex-col w-full p-3.5 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
          <Link href="/enrollments" className="text-[10px] text-[#6F7282]">GO TO DASHBOARD</Link>
          <h5 className="text-[17px] font-semibold mt-1 mb-3">{course?.course}</h5>
          <Progress 
            size="sm" 
            aria-label="Loading..." 
            value={course?.progress} 
            classNames={{
              indicator:"bg-[#000]",
            }}
          />
          <p className="text-sm font-semibold mt-1.5">{course?.progress}% <span className="text-[12px] font-medium text-[#36394D]">complete</span></p>

        </div>

        {/* Search */}
        <div className="myFlex flex-col w-full bg-[#F2F3F5] px-3 py-2.5">
          {/* Input alike */}
          <div 
            className={`relative flex items-start justify-start bg-transparent w-full rounded-[3px] ${openDrop && "rounded-b-none"} px-3 py-1.5 border-[0.5px] border-[#CACCD6] cursor-pointer ${openDrop && "bg-white"} hover:bg-white`}
            onClick={()=> setOpenDrop(!openDrop)}
          >
            <span className="text-[13px] text-[#36394D]">Search by lesson title</span>
            {/* Arrow */}
            <div className="absolute top-1/2 -translate-y-1/2 right-2 myFlex w-fit h-fit">
              <FaCaretDown className="w-3 h-3 text-[#36394D]"/>
            </div>
          </div>

          {/* Dropdown alike */}
          <div className={`${!openDrop ? "hidden" : "flex"} relative flex-col items-center justify-start w-full bg-white rounded-b-[4px] border-[0.5px] border-t-none border-[#CACCD6] pt-3`}>
            {/* Input */}
            <div className="px-3 myFlex w-full">
              <div className="myFlex gap-x-2.5 w-full px-2 pb-1.5 pt-1.5 rounded-[4px] border-[0.5px] border-[#CACCD6] ring-1 ring-transparent focus-within:border-black focus-within:ring-black">
                <IoSearchOutline className="w-[14px] h-[14px] text-black"/>
                <input value={input} onChange={(e)=> setInput(e.target.value)} type="text" className="text-[11px] tracking-wide flex flex-1 focus:border-none focus:outline-none" />
              </div>
            </div>

            {/* Results */}
            <div className="flex items-start justify-start flex-col w-full h-[160px] overflow-y-auto">
              {results ? (
                results.length ? (
                  results.map((step: Step, i:number)=>(
                    <div 
                      key={i}
                      className="flex flex-col items-start justify-start pt-2 w-full"
                    >
                      <p className="text-[11.5px] font-semibold uppercase py-1.5 px-3">{step.title}</p>
                      {step.list.map((each: List, _:number)=>(
                        <p
                          key={each.name}
                          onClick={()=> handleSection(each, step.title)}
                          className="w-full text-[12.5px] pl-5 pr-3 py-2 font-light hover:bg-[#F2F3F5] cursor-pointer"
                        >
                          {each.name}
                        </p>
                      ))}
                    </div>
                  ))
                ):(
                  <p className="w-full text-[12.5px] pl-5 pr-3 py-2 font-light hover:bg-[#F2F3F5] cursor-pointer">No results found.</p>
                )
              ):(
                course?.steps.map((step, i)=>(
                  <div 
                    key={i}
                    className="flex flex-col items-start justify-start pt-2 w-full"
                  >
                    <p className="text-[11.5px] font-semibold uppercase py-1.5 px-3">{step.title}</p>
                    {step.list.map((each, _)=>(
                      <p
                        onClick={()=> handleSection(each, step.title)}
                        key={each.name}
                        className="w-full text-[12.5px] pl-5 pr-3 py-2 font-light hover:bg-[#F2F3F5] cursor-pointer"
                      >
                        {each.name}
                      </p>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Accordion */}
        <div className="w-full h-fit flex items-start justify-center px-3 py-2.5 bg-[#F2F3F5]">
          {course && (
            <Accordion
              selectedKeys={selectedKeys}
              onSelectionChange={setSelectedKeys}
            >
              {course.steps.map((step, i)=>(
                <AccordionItem 
                  key={step.title} 
                  aria-label={step.title} 
                  title={step.title}
                  disableIndicatorAnimation
                  className={`${i + 1 === course.steps.length && "pb-14"}`}
                  startContent={step.completed ? <IoIosCheckmarkCircle className="w-[22px] h-[22px]"/> : <IoIosCheckmarkCircleOutline className="w-[22px] h-[22px]"/>}  
                  indicator={
                    <div className="myFlex gap-x-4">
                      <span className="text-[13.4px] text-[#36394D]">{step.list.length}/{step.list.length}</span>
                      <FaAngleDown className="w-3 h-3 text-[#6F7282]"/>
                    </div>
                  }
                  classNames={{
                    base:"group-[.is-splitted]:rounded-sm group-[.is-splitted]:shadow-none group-[.is-splitted]:bg-[rgba(42,220,132,0.1)] data-[open=true]:group-[.is-splitted]:bg-[rgba(42,220,132,0.3)]",
                    trigger:"py-3 data-[open=true]:border-b-[1px] border-[#1f1f1f]",
                    title:"text-[14.4px] tracking-wide source-sans font-semibold text-[#36394D] rounded-sm",
                    startContent:"text-[13px] pr-1",
                    indicator:"pr-2",
                  }}
                >
                  <div className="flex items-start justify-start flex-col gap-y-1 mt-1">
                    {step.list.map((each, _)=> (
                      <div 
                        key={each.name}
                        className={`group relative flex items-start z-20 cursor-pointer w-full justify-start gap-x-5 pl-[3px]`}
                        onClick={()=> handleSection(each, step.title)}
                      >

                        {/* Selected Background */}
                        {section?.substep.name === each.name && (
                          <div className="h-[calc(100%+10px)] absolute -top-1.5 left-0 w-full bg-gray-400/20 z-10">

                          </div>
                        )}
                        
                        {/* Icon & Bar */}
                        <div className="myFlex flex-col gap-y-1 z-20">
                          {each.completed ? (
                            <IoIosCheckmarkCircle className="w-[16px] h-[16px]"/>
                            ):(
                            <IoIosCheckmarkCircleOutline className="w-[16px] h-[16px]"/>
                          )}
                          <div className={`h-[35px] w-[1.5px] rounded-full ${(_ + 1) < step.list.length && " bg-black"}`}></div>
                        </div>

                        {/* Content */}
                        <div className={`relative z-20 flex items-start justify-center flex-col gap-y-1 -mt-[2.5px]`}>
                          

                          {/* Title */}
                          <span className="text-[13px]">{each.name}</span>

                          {/* Tags */}
                          <div className={`flex items-center justify-start gap-x-1 text-[#36394D]`}>
                            {/* Icon */}
                            {each.type === "video" ? <IoVideocamOutline className="mr-1 w-[14px] h-[14px] text-[#6F7282]"/> : each.type === "download" ? <IoCloudDownloadOutline className="mr-1 w-[14px] h-[14px] text-[#6F7282]"/> : each.type === "quiz" ? <GoChecklist className="mr-1 w-[14px] h-[14px] text-[#6F7282]"/> : "" }

                            {/* Type */}
                            <span className="uppercase text-[10px]">{each.type}</span>
                            {(each.duration || each.questions) && <span className="text-[9px]">•</span>}                        

                            {/* Duration & Questions */}
                            {each.duration && (each.duration < 1 ? <span className="text-[10px]">{`<${each.duration} MIN`}</span> : <span className="text-[10px]">{`${each.duration} MIN`}</span>)}
                            {each.questions && <span className="text-[10px]">{`${each.questions} QUESTIONS`}</span>}

                            {/* Prerequisite */}
                            {each.prerequisite && <span className="text-[10px]">PREREQUISITE</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </article>
   );
}
 
export default PanelModal;