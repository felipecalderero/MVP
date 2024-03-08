import { NextResponse } from "next/server";
import { S3, PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

export async function POST(request: Request){
  const { fileName, fileBuffer, fileType } = await request.json();
  const myBuffer = Buffer.isBuffer(fileBuffer) ? fileBuffer : Buffer.from(fileBuffer);
  console.log(fileName, fileType);
  // return NextResponse.json("AWS");

  
  const s3client = new S3({
    region:"us-east-2",
    credentials: {
      accessKeyId: process.env.AWS_KEY!,
      secretAccessKey: process.env.AWS_S_KEY!
    }
  });

  const params = {
    Bucket: 'my-mental-wellbeing',
    Key: fileName,
    Body: myBuffer,
    ContentType: fileType
  };

  try{
    const upload = new Upload({
      client: s3client,
      params
    })

    await upload.done();
    
    return NextResponse.json({success: true});
    
  }catch(error){
    console.log(error);
    
    return NextResponse.json({success: false});

  }
  
}