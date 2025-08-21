export type StudentType = {
  _id: string;
  name: string;
  img?: string;
  email: string;
  about?: string;
  address?: string;
  location: {
    coordinates: number[];
  };
};

export type TutorSearchType = {
  _id: string;
  name: string;
  status: string;
  img?: string;
  isOnline?: boolean;

  skills?: string[];
  latitude?: number;
  longitude?: number;
  distance?: number;
  address?: string;
  about?: string;
};

export type TutorType = {
  _id: string;
  email: string;
  name: string;
  img?: string;
  // requests: {
  //   _id: string;
  //   name: string;
  //   img?: string;
  //   // status: "accepted" | "rejected" | "pending" | "-";
  //   status: string;
  // }[];
  educations: {
    institute: string;
    degree: string;
    from: number;
    to: number;
  }[];
  skills: {
    name: string;
    level: number;
  }[];
  workExperiences: {
    company: string;
    position: string;
    from: number;
    to: number;
  }[];
  location: {
    coordinates: number[];
  };
};

export type MssgType = {
  isStudent: boolean;
  mssg: string;
  time: string;
  img?: string;
  ai: boolean;
};
