interface SectionObjectFormat {
    stepTitle: string;
    substep: {
      name:string,
      type: string,
      duration: number | null,
      prerequisite: boolean,
      questions: number | null,
      completed: boolean,
      video: string
    }
}

export interface CustomUser {
  displayName: string | null;
  image: string | null;
  email: string | null;
  provider: string | null;
  courses: any;
  favorites: any;
  profession: string | null;
  uid: string | null;
}

// Course

export interface UserCourse {
  course: string
  image: string
  id: string;
  author: Author
  students: any[]
  rating?: Rating[]
  steps: Step[]
  completed: boolean
  progress: number
}

export interface Course {
  course: string
  image: string
  id: string;
  author: Author
  students: any[]
  rating?: Rating[]
  steps: Step[]
  completed: null
  progress: null
}

export interface Author {
  name: string
  image: string
  profession: string
}

export interface Rating {
  user: string
  rate: number
}

export interface Step {
  title: string
  list: List[]
  completed: boolean
}

export interface List {
  name: string
  type: string
  duration: number
  prerequisite: boolean
  questions: any
  completed: boolean
  video: string
}