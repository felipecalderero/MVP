import openai from "@/utils/OpenAi/openAi";
import { NextResponse } from "next/server";
import jsonCourses from "../../../../courses.json";
// export const maxDuration = 300;

const coursesTitles = [
  "Mental Health Converesation",
  "Stress Management",
  "Burnout Prevention",
  "Building Resilience"
]

export async function POST(request: Request){

  const { userFeelings, coursesData } = await request.json();
  
  try{
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.8,
      n: 1,
      stream: false,
      messages:[
        {
          role: "system",
          content:`The user is going to tell you how he/she feels. For example 'I feel stressed'. With this information, you'll have to map the array of objects, where each object contains a course. If it helps, here you have the courses titles: ${coursesTitles}. Now, after mapping the array of object where each object contains a course, I need you to select an object, only ONE, of that array that contains a course that matches the user feelings. Copy the object exactly as it is, don't change anything. Your final response must be an object with three properties. One is 'why', here you must express why you chose this course. The other property must be 'title', here you will put the title of the course. The last property must be 'recommendation', an object with 2 properties: 'title' and 'reason'. You will find that each course has a property called 'Steps', this is an array of objects, what I need you to do is map this array and find a step that fits better to what the user expressed he felt. Take the title of the step you chose and put it in the property 'title' of 'recommendation', then in the property 'reason' put the reason why you chose that step. In the case you can’t find any course that matches the user feelings, or the user writes something not related with mental health, or the text you received for the user is nonsense, for example: 'adadede', respond an empty string like this: “”.`
        },
        {
          role: "user",
          content: `Hi there, this is how I feel: ${userFeelings}. This is the array with the courses:${coursesData}. Remember you must grab an object from that array that matches with how I feel.`,
        }
      ]
    });
  
    const response = chatCompletion.choices[0].message
    
    
    return NextResponse.json(response)

  }catch(error){
    console.log(error);
    return NextResponse.json({ERROR_IS__: error})
  }
}