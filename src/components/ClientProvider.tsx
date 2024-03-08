'use client'

import { ReactNode, useEffect } from "react";
import {NextUIProvider} from "@nextui-org/react";
import { db, auth} from "../../firebase"
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { useCourses, useFirebaseUser } from "@/store/store";
import { collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { CustomUser } from "../../typings";

const ClientProvider = ({children}:{children:ReactNode}) => {
  
  const [user, setUser] = useFirebaseUser(state => [state.user, state.setUser]);
  const [setCourses] = useCourses(state => [state.setCourses]);
  
  const [Users, loading, error] = useCollection(
    collection(db, "Users"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const [Courses, coursesLoading, coursesError] = useCollection(
    collection(db, "Courses"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  
  const firebaseUser = auth.currentUser;
  
  useEffect(() => {
    if(Users?.docs.length){
      const sessionExist = localStorage.getItem("mmw-user");
      if(sessionExist){
        const parsedUser = JSON.parse(sessionExist);
        Users?.docs.map((doc)=> {
          if(doc.data().provider === parsedUser.providerData[0].providerId && doc.data().uid === parsedUser.uid){
            return setUser(JSON.parse(JSON.stringify(doc.data())));
          }
        });
      }else{
        setUser(null);
      }
    }
  }, [firebaseUser, Users]);

  
  // useEffect(() => {
  //   if (firebaseUser && Users?.docs.length) {
      
  //     Users?.docs.map((doc)=> {
  //       if(doc.data().provider === firebaseUser.providerData[0].providerId && doc.data().uid === firebaseUser.uid){
  //        return setUser(JSON.parse(JSON.stringify(doc.data())));
  //       }
  //     });
  //   };
  // }, [firebaseUser, Users]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (!firebaseUser) {
  //       setUser(null);
  //     }
  //   }, 10000);
  
  //   return () => clearTimeout(timer);
  // }, [firebaseUser]);

 
  

  useEffect(() => {
    if(Courses?.docs.length){
      setCourses(JSON.parse(Courses?.docs[0].data().data));
      console.log(JSON.parse(Courses?.docs[0].data().data));
      
    }
  }, [Courses]);

  return ( 
    <NextUIProvider>
      {children}
    </NextUIProvider>
   );
}
 
export default ClientProvider;