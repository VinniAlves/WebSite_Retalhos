import type { JSX } from "react";
import Catalogo from "../Catalogo/Catalogo"


const ROUTE_PATH = "/catalogo"

const PATHCatalogo: {path:string; element: JSX.Element}[]=[
    {
        path: ROUTE_PATH,
        element: <Catalogo/>
    }   
];

export default PATHCatalogo