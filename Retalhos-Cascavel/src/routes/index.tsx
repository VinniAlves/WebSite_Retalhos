
import { useMemo } from "react";
import PATHHome from "./Home.routes";
import PATHCatalogo from "./Catalogo.routes";
import PATHProduto from "./Produto.routes";

function useRoutes(){
    const routes = useMemo(()=>[
         ...PATHHome,
         ...PATHCatalogo,
         ...PATHProduto
    ],[])
    return routes

}

export default useRoutes;