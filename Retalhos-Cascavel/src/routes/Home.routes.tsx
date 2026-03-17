import type { JSX } from "react";
import Home from "../Home/Home"


const ROUTE_PATH = "/"

const PATHHome: {path:string; element: JSX.Element}[]=[
    {
        path: ROUTE_PATH,
        element: <Home/>
    }   
];

export default PATHHome