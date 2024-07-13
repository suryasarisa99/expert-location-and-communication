import {
  StudentType,
  TutorSearchType,
  TutorType,
} from "@src/types/StudentType";
import React from "react";

type DataContextTypes = {
  data: StudentType | null;
  setData: React.Dispatch<React.SetStateAction<StudentType | null>>;
  tutors: TutorSearchType[];
  setTutors: React.Dispatch<React.SetStateAction<TutorSearchType[]>>;
  currentTutor: TutorType | null;
  setCurrentTutor: React.Dispatch<React.SetStateAction<TutorType | null>>;
  role: number;
  setRole: React.Dispatch<React.SetStateAction<number>>;
  selectedFile: string | undefined;
  setSelectedFile: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export default DataContextTypes;
