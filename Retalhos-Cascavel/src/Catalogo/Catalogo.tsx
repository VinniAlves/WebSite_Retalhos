import * as S from "./styles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import mock from "../mock.json";

const FiltersCategoria = [
    {
        id:"1",
        name:"Almas",
        value:"almas"
    },
    {
        id:"2",
        name:"Alojamento Farol",
        value:"alojamentoFarol"
    },
    {
        id:"3",
        name:"Assoalhos",
        value:"assoalhos"
    },
    {
        id:"4",
        name:"Caixa Roda",
        value:"caixaRoda"
    },
    {
        id:"5",
        name:"Caixa de ar",
        value:"caixaAr"
    },
    {
        id:"6",
        name:"Colunas",
        value:"colunas"
    },
    {
        id:"7",
        name:"Capo",
        value:"capo"
    },
    {
        id:"8",
        name:"Quadro Porta",
        value:"quadroPorta"
    },
    {
        id:"9",
        name:"Laterais",
        value:"lateral"
    },
    {
        id:"10",
        name:"Longarinas",
        value:"longarinas"
    },
    {
        id:"11",
        name:"Paineis",
        value:"painel"
    },
    {
        id:"12",
        name:"Parachoques",
        value:"parachoque"
    },
    {
        id:"13",
        name:"Portas",
        value:"portas"
    },
    {
        id:"14",
        name:"Paralamas",
        value:"paralama"
    },
    {
        id:"15",
        name:"Soleiras travessas",
        value:"soleirasTravessas"
    },
    {
        id:"16",
        name:"Travessas",
        value:"travessas"
    }
]

const FiltersMarca = [
{
        id:"1",
        name:"BMW",
        value:"bmw"
    },
    {
        id:"2",
        name:"Audi",
        value:"audi"
    },
    {
        id:"3",
        name:"Volkswagen",
        value:"volkswagen"
    },
    {
        id:"4",
        name:"Fiat",
        value:"fiat"
    },
    {
        id:"5",
        name:"Ford",
        value:"ford"
    },
    {
        id:"6",
        name:"Chevrolet",
        value:"chevrolet"
    },
    {
        id:"7",
        name:"Citroen",
        value:"citroen"
    },
    {
        id:"8",
        name:"Peugeot",
        value:"peugeot"
    },
    {
        id:"9",
        name:"Renault",
        value:"renault"
    },
    {
        id:"10",
        name:"Mercedes",
        value:"mercedes"
    },
    {
        id:"11",
        name:"Honda",
        value:"honda"
    },
    {
        id:"12",
        name:"Hyundai",
        value:"hyundai"
    },
    {
        id:"13",
        name:"Jeep",
        value:"jeep"
    },
    {
        id:"14",
        name:"Kia",
        value:"kia"
    }
]


function CheckboxFilter(){
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [isOpenCategoria, setIsOpenCategoria] = useState(true);
    const [isOpenMarca, setIsOpenMarca] = useState(true);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedColors((prev) => [...prev, value]);
        } else {
            setSelectedColors((prev) => prev.filter((color) => color !== value));
        }
    };

    return(
         <div>
            <form name="test">
                <S.FilterHeader onClick={() => setIsOpenCategoria(!isOpenCategoria)}>
                    Categoria {isOpenCategoria ? '▲' : '▼'}
                </S.FilterHeader>
                {isOpenCategoria && FiltersCategoria.map((item) => (
                    <div key={item.id}>
                        <input type="checkbox" name="colors" value={item.value} onChange={handleCheckboxChange} /> {item.name} <br/>
                    </div>
                ))}
                    <S.Divider/>
                <S.FilterHeader onClick={() => setIsOpenMarca(!isOpenMarca)}>
                    Marca {isOpenMarca ? '▲' : '▼'}
                </S.FilterHeader>
                {isOpenMarca && FiltersMarca.map((item) => (
                    <div key={item.id}>
                        <input type="checkbox" name="colors" value={item.value} onChange={handleCheckboxChange} /> {item.name} <br/>
                    </div>
                ))}
                
               
            </form>
         </div>
    )
}



function Catalogo() {
    const [isOpenPreco, setIsOpenPreco] = useState(true);
    const navigate = useNavigate();

    return(
        <>

           <S.Container>
            <S.ContainerFilter> 
                <div>
                    <h2>Filtros</h2>
                    <CheckboxFilter></CheckboxFilter>
                    <S.Divider/>
                    <S.FilterHeader onClick={() => setIsOpenPreco(!isOpenPreco)}>
                        Preço {isOpenPreco ? '-' : '+'}
                    </S.FilterHeader>
                    {isOpenPreco && (
                        <S.Pricing>
                            <input placeholder="Mínimo"></input>
                            <p> - </p>
                            <input placeholder="Máximo"></input>
                        </S.Pricing>
                    )}
                </div>
                <button>Buscar</button>
              
            </S.ContainerFilter>
            <S.ContainerProduct>
                {mock.carrocel.map((item, index) => (
                    <S.ProductCard key={index} onClick={() => navigate(`/produto/${item.idProduto}`)}>
                        <img src={item.imgurl} alt={item.title} />
                        <S.ProductInfo>
                            <h3>{item.title}</h3>
                            <p>{item.type}</p>
                            <span>{item.price}</span>
                        </S.ProductInfo>
                    </S.ProductCard>
                ))}
            </S.ContainerProduct>

           </S.Container>
        
        </>
    )
}

export default Catalogo