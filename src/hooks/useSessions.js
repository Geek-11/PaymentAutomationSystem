import { useContext } from "react";
import { SessionContext } from "@/contexts/SessionContext";

export const useSessions=()=>useContext(SessionContext)