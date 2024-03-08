const Loading = () => {
  return ( 
    <div className="fixed top-0 left-0 h-screen myFlex w-full overflow-hidden z-[2000] bg-[#fffbf7]">
      <div className="relative h-full w-full myFlex">
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
        
        <div className="rounded-full w-[500px] z-30 myFlex">
          <div className="relative w-[120px] h-[120px] p-2 rounded-full bg-[#134731] animate-bounce myFlex">
              <img src="/images/Logo2.svg" alt="" className="w-full" />
          </div>
        </div>
      </div>
    </div>
   );
}
 
export default Loading;