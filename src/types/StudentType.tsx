export type StudentType = {
  _id: string;
  name: string;
  tutors: {
    _id: string;
    name: string;
    hasStartedChat: boolean;
    lastMssg: string;
    lastTime: string;
  }[];
};

export type TutorSearchType = {
  _id: string;
  name: string;
  status: string;
};

export type TutorType = {
  _id: string;
  email: string;
  name: string;
  requests: {
    _id: string;
    name: string;
    // status: "accepted" | "rejected" | "pending" | "-";
    status: string;
  }[];
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
};
