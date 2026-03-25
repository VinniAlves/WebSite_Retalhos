import { useState } from "react";
import logo from '../../assets/image/Logo.png'
import * as S from "./styles";
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from "react-router-dom"

const buttonsSearch = [
    {
        id:2,
        name: "Alma"
    },
    {
        id:3,
        name: "Alojamento Farol"
    },
    {
        id:6,
        name: "Caixa de AR"
    },
    {
        id:7,
        name: "Colunas"
    },
    {
        id:10,
        name: "Laterais"
    },
    {
        id:14,
        name: "Paralamas"
    },
    {
        name: "Outros"
    },
]



function Header() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = async () => {
        if (!searchTerm.trim()) return;

        try {
            const response = await fetch('http://localhost:8080/retalhos.cascavel/products/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ search: searchTerm }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // Navega para o catálogo passando os produtos no state
            navigate("/catalogo", { state: { products: data.products, searchTerm: searchTerm } });
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        }
    };

    const handleCategoryFilter = async (categoryId?: number) => {
        try {
            const bodyData = {
                categoria: categoryId ? [categoryId] : undefined,
                page: 1
            };

            const response = await fetch('http://localhost:8080/retalhos.cascavel/products/filter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            navigate("/catalogo", { 
                state: { 
                    products: data.products || [], 
                    pagination: data.pagination,
                    selectedCategorias: categoryId ? [categoryId] : []
                } 
            });
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <S.Container>
            <S.Search>
                
                <S.Logo src={logo} alt="" onClick={()=> navigate("/")} style={{ cursor: 'pointer' }}/>
                
                <S.InputSearch>
                    <SearchIcon 
                        style={{ color: "#cfcfcfff", cursor: 'pointer' }} 
                        onClick={handleSearch}
                    />
                    <S.InputCamp 
                        type="text" 
                        placeholder="Buscar peça.." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </S.InputSearch>
                
            </S.Search>
            <S.ButtonSearch>
                {
                    buttonsSearch.map((button, index) => (
                        <button 
                            key={index}
                            onClick={() => handleCategoryFilter(button.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            {button.name}
                        </button>
                    ))
                }
            </S.ButtonSearch>
        </S.Container>
    )
}

export default Header