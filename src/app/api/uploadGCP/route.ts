import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";

const projectId = process.env.GCP_PROJECT_ID!;
const bucketName = process.env.GCP_BUCKET_NAME!;
const keyFilename = `{
  "type": "service_account",
  "project_id": "website-416623",
  "private_key_id": "7211dcca199a16b20f081453b5cb441fbcc32053",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQClyvioQ//VU8tL\nhtSi6Azfkl5OgBCkya7TGP3Xgu7TgSGL8GOEsYAYdG5zlAJ2SEcu7jLauexHI84A\nROqZZkM33JTypECQWFekGxEh+fYKkZeynn8P/HXPJahDs2fnfkI368ny38PqyUuj\neQzj0GnR/yvNdgswXBh8xl8bwrlRbg22in1qP+uL413VTJBlH//dK7z/K3cWS/LI\nzUzf8sFixE40voKWkLHnjDN11zdsaw3UuX9ELAorDuJ4L/QjK/eRtw3IJZKaRcNH\nCqGPEETzvaVq/AjLBM9YF2KpsmOMMYLkW5xaLwEcvYd8SyUDKU8kZTuTSgY9uJor\nsZihvX+JAgMBAAECggEACBFBWka8yy+ho9IyxJ6QCc0Ag8ddh/c8Z48+wt7fKjGN\nZVbUMN/GQOpheYRJPmIz/Iegt932LlwCqSaxV7ePK8ezA7+UWLHDyft7MPEN1OPS\nwuFNg4SgYu0NLAYt1yjgpgH2OLhEu0cCRDketHMuwwYspnnI/5hrpJ6ugBZQmDKz\nqJcWdxMCjBfPrKYChLGpdtI4Fcc5f9A0nS4ahV5yMoilJqyb7LZO5KtgaW4w09bO\nZVyIn4DKfuygwFHg1lAQv/1SFpRSWatuC2BOmJmfhSS8S7U2Y5w4znSGQ7luRhLE\n3RWyr6IqE/dFDMlXnaL4aApnAyHwZI90nAY/IRC3FQKBgQDacu4+vj0xyeMHeQRe\ngyNmuAHbQIKFXQXunfRqk3uC7jaV72XlnjkMBT42W0YHsXu5ZYfk1PnDF5s0YabQ\nSW1QASwndudXb6RFZSEMsB/RmmgsR4mhbW+L5KtVP/rOc0td1Qu+jzCZqbDzmius\nKWRTnfRxR5A5Jgf/fWt/XOnuCwKBgQDCStsEI0M3s9gOt6lQu4Uiie9yzboZ29Db\n/5nkL/hxWhM+d3UksODKfduWxHaDnb5sQ0nZC/EshwoQG/Glj6hpv2sGHVoXr2zF\n/GASMGbZE8tdAZwjtQjoXRQsOAz/BWN16NCRLt56OTj4ECt7Liw2xJbqw74DesM2\n8INWQOfJOwKBgCex/NMP9MTIX+Xqur2F7PfsdgHmfhFH7x0GPPTk6evH58llIEoS\nb2FczopIGbiqKsZsyb3uaZhnAMALAqoUvbVtER32wGEmG1602sWYd5+6BDYPpdXc\nsglkuzGZl7TORKK/ZQvyry0tJceOe2MkfmOnb1TqYS3RWGC35MHXG3czAoGAVuAR\nvm/mBmosGaiV1LuEdEUpBDRpGlbntPc9YILym/yizjOr9ZQBb4mHPorqUz+dfds4\nkgx88mQPY9Sa4GSz8VTeDgXh2uVdxclrS7bIxhfLvvKRVoYETaIQ+xS0+vL13isT\n11cVs6ESkBjq2FF1A6gzsxWDSRsDXvV8RH0RJzECgYBemArql9WaPpavjedObl+C\n5juIUJbWdH7VWQyFUqgLjkKzkZQiip8V4NC0NDOQEh7SAqBKDOAgcrsrk7MKZQG0\ngsVVv2J0uEVBcs6rX3aYZaE4NwQt0pNs7bEnH9/SuM04W6RvoLXCC688TMc+LRdl\nueLmrxujFGHMg/BJ/Frb1g==\n-----END PRIVATE KEY-----\n",
  "client_email": "mymentalwellbeing-gcp-buckets@website-416623.iam.gserviceaccount.com",
  "client_id": "115821720863348549879",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/mymentalwellbeing-gcp-buckets%40website-416623.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}`;


export async function POST(request: Request){
  
  const { file, fileName, fileType } = await request.json();
  const myBuffer = Buffer.from(file, 'base64');

  console.log(myBuffer);
  
  
  try{
      const storage = new Storage({ keyFilename: 'GCP-Credentials.json' });
      const bucket = storage.bucket(bucketName);
      const blob = bucket.file(fileName);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: fileType,
        },
        resumable: false,
      });
  
      blobStream.on('error', (err) => {
        console.error(err);
        throw err;
      });
  
      blobStream.on('finish', () => {
        console.log('File uploaded to Google Cloud Storage');
      });
  
      blobStream.end(myBuffer);
    
    return NextResponse.json({success: true});
    
  }catch(error){
    console.log(error);
    
    return NextResponse.json({success: false});

  }
  
}