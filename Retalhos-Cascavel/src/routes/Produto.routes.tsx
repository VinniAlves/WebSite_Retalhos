import type { JSX } from "react";
import Produto from "../Produto/Produto"


const ROUTE_PATH = "/produto/:id"

const PATHProduto: {path:string; element: JSX.Element}[]=[
    {
        path: ROUTE_PATH,
        element: <Produto/>
    }   
];

export default PATHProduto
