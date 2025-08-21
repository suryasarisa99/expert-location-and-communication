import { useContext } from "react";
import { DataContext } from "../context/Data/DataContext";
import DataContextTypes from "@context/Data/DataContextTypes";

export default function useData(): DataContextTypes {
  return useContext(DataContext);
}
