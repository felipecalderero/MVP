import { create } from "zustand";
import { User as FirebaseUser } from "firebase/auth";
import { Course } from "../../typings";

interface CustomUser {
  displayName: string | null;
  image: string | null;
  email: string | null;
  provider: string | null;
  profession: string;
  courses: any;
  favorites: any;
  uid: string | null;
}

interface FirebaseUserState {
  user: CustomUser | null | undefined;
  setUser: (user: CustomUser | null | undefined) => void;
};


export const useFirebaseUser = create<FirebaseUserState>((set)=> ({
  user: undefined,
  setUser: (user: CustomUser | null | undefined) => set({ user }),
}));


interface CoursesState {
  courses: Course[],
  setCourses: (courses: any) => void;
};

export const useCourses = create<CoursesState>((set)=> ({
  courses: [],
  setCourses: (courses: Course[]) => set({ courses }),
}));
