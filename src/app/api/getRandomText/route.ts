import openai from "@/utils/OpenAi/openAi";
import { NextResponse } from "next/server";

export async function GET(request: Request){
  try{
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.8,
      n: 1,
      stream: false,
      messages:[
        {
          role: "user",
          content: `Give me a short curious fact, no more that 250 characters, about mental health in workplaces. For example:'No stress workplaces improves employees performance.'`,
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