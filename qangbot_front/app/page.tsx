"use client"
import { isKnown } from "@/GlobalStates/Slices/userSlice";
import {  useAppSelector ,useAppDispatch } from "@/GlobalStates/hooks";
import {
  newState,

} from "@/GlobalStates/Slices/userSlice";


export default function Home() {
  const userisKnown = useAppSelector(isKnown);
  const setUserIsKnow = useAppDispatch();
  return (
    <main className="">
          {userisKnown ? "loged" : "NOTloged"}
          loged
          <br />
          <button onClick={() => setUserIsKnow(newState(true))}>login</button>
          <br />
          <button onClick={() => setUserIsKnow(newState(false))}>logout</button>
    </main>
  );
}
