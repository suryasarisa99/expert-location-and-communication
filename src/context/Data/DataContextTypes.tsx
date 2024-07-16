import {
  MssgType,
  StudentType,
  TutorSearchType,
  TutorType,
} from "@src/types/StudentType";
import React from "react";

type DataContextTypes = {
  data: StudentType | null;
  setData: React.Dispatch<React.SetStateAction<StudentType | null>>;
  users: TutorSearchType[];
  setUsers: React.Dispatch<React.SetStateAction<TutorSearchType[]>>;
  currentTutor: TutorType | null;
  setCurrentTutor: React.Dispatch<React.SetStateAction<TutorType | null>>;
  role: number;
  setRole: React.Dispatch<React.SetStateAction<number>>;
  selectedFile: string | undefined;
  setSelectedFile: React.Dispatch<React.SetStateAction<string | undefined>>;
  newMssgs: { [key: string]: number };
  setNewMssgs: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
  messages: MssgType[];
  setMessages: React.Dispatch<React.SetStateAction<MssgType[]>>;
};

export default DataContextTypes;
