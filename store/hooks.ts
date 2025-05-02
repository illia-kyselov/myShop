import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";

export const useAppDispatch = () => useDispatch();
export const useAppSelector = <T>(selector: (state: RootState) => T) => useSelector(selector);
