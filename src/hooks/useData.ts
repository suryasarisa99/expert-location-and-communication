import { useContext } from "react";
import { DataContext } from "../context/Data/DataContext";

export default function useData() {
  return useContext(DataContext);
}
