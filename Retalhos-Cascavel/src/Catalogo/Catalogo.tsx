import * as S from "./styles";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import converNumbers from "../utils/ConvertNumbers";

interface Categoria {
    id: number;
    nome_categoria: string;
}

interface Marca {
    id: number;
    marca: string;
}

function Catalogo() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Prioriza os produtos vindo do state (busca)
    const [products, setProducts] = useState<ProdutosInterface.ProductProp[]>(location.state?.products || []);
    const [searchTerm, setSearchTerm] = useState(location.state?.searchTerm || "");

    // Filter UI States
    const [isOpenCategoria, setIsOpenCategoria] = useState(true);
    const [isOpenMarca, setIsOpenMarca] = useState(true);
    const [isOpenPreco, setIsOpenPreco] = useState(true);

    // Filter Data States
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [marcas, setMarcas] = useState<Marca[]>([]);

    // Selected Filters States
    const [selectedCategorias, setSelectedCategorias] = useState<number[]>(location.state?.selectedCategorias || []);
    const [selectedMarcas, setSelectedMarcas] = useState<number[]>([]);
    const [minPrice, setMinPrice] = useState<string>("");
    const [maxPrice, setMaxPrice] = useState<string>("");
    
    // Pagination State
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const handleFilterSearch = useCallback(async (currentPage = 1) => {
        try {
            const bodyData = {
                categoria: selectedCategorias.length > 0 ? selectedCategorias : undefined,
                marca: selectedMarcas.length > 0 ? selectedMarcas : undefined,
                minPrice: minPrice ? parseFloat(minPrice) : undefined,
                maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
                page: currentPage
            };

            const response = await fetch('http://localhost:8080/retalhos.cascavel/products/filter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setProducts(data.products || []);
            setSearchTerm(""); // Limpa o termo de busca pois agora é um filtro específico
            if (data.pagination) {
                setPage(data.pagination.currentPage);
                setTotalPages(data.pagination.totalPages);
            }
        } catch (error) {
            console.error("Erro ao filtrar produtos:", error);
        }
    }, [selectedCategorias, selectedMarcas, minPrice, maxPrice]);

    useEffect(() => {
        if (location.state?.products) {
            setProducts(location.state.products);
            if (location.state?.pagination) {
                setPage(location.state.pagination.currentPage);
                setTotalPages(location.state.pagination.totalPages);
            }
            if (location.state?.selectedCategorias) {
                setSelectedCategorias(location.state.selectedCategorias);
            }
        } else if (!location.state?.searchTerm) {
            // Se não tem produtos e não há termo de busca, faz fetch inicial
            handleFilterSearch(1);
        }
        
        if (location.state?.searchTerm) {
            setSearchTerm(location.state.searchTerm);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.state]);

    // Fetch Categorias and Marcas on mount
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [catRes, marRes] = await Promise.all([
                    fetch('http://localhost:8080/retalhos.cascavel/category'),
                    fetch('http://localhost:8080/retalhos.cascavel/mark')
                ]);
                
                if (catRes.ok) {
                    const catData = await catRes.json();
                    setCategorias(catData.map((c: any) => ({ id: c.id, nome_categoria: c.nome_categoria })));
                }
                
                if (marRes.ok) {
                    const marData = await marRes.json();
                    setMarcas(marData.map((m: any) => ({ id: m.id, marca: m.marca })));
                }
            } catch (error) {
                console.error("Erro ao buscar filtros:", error);
            }
        };

        fetchFilters();
    }, []);

    const handleCheckboxCategoria = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
        if (event.target.checked) {
            setSelectedCategorias(prev => [...prev, value]);
        } else {
            setSelectedCategorias(prev => prev.filter(id => id !== value));
        }
    };

    const handleCheckboxMarca = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
        if (event.target.checked) {
            setSelectedMarcas(prev => [...prev, value]);
        } else {
            setSelectedMarcas(prev => prev.filter(id => id !== value));
        }
    };

    const handleViewPhoto = (image: string) => {
        if (!image) return "";
        return image.startsWith('http') ? image : `http://localhost:8080/retalhos.cascavel${image}`;
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            handleFilterSearch(newPage);
        }
    };

    return (
        <>
           <S.Container>
            <S.ContainerFilter> 
                <div>
                    <h2>Filtros</h2>
                    <div>
                        <form onSubmit={(e) => { e.preventDefault(); handleFilterSearch(1); }}>
                            <S.FilterHeader onClick={() => setIsOpenCategoria(!isOpenCategoria)}>
                                Categoria {isOpenCategoria ? '▲' : '▼'}
                            </S.FilterHeader>
                            {isOpenCategoria && categorias.map((item) => (
                                <div key={item.id}>
                                    <input 
                                        type="checkbox" 
                                        value={item.id} 
                                        onChange={handleCheckboxCategoria} 
                                        checked={selectedCategorias.includes(item.id)}
                                    /> {item.nome_categoria} <br/>
                                </div>
                            ))}
                                <S.Divider/>
                            <S.FilterHeader onClick={() => setIsOpenMarca(!isOpenMarca)}>
                                Marca {isOpenMarca ? '▲' : '▼'}
                            </S.FilterHeader>
                            {isOpenMarca && marcas.map((item) => (
                                <div key={item.id}>
                                    <input 
                                        type="checkbox" 
                                        value={item.id} 
                                        onChange={handleCheckboxMarca} 
                                        checked={selectedMarcas.includes(item.id)}
                                    /> {item.marca} <br/>
                                </div>
                            ))}
                        </form>
                     </div>
                    <S.Divider/>
                    <S.FilterHeader onClick={() => setIsOpenPreco(!isOpenPreco)}>
                        Preço {isOpenPreco ? '-' : '+'}
                    </S.FilterHeader>
                    {isOpenPreco && (
                        <S.Pricing>
                            <input 
                                placeholder="Mínimo" 
                                type="number" 
                                step="0.01" 
                                value={minPrice} 
                                onChange={(e) => setMinPrice(e.target.value)} 
                            />
                            <p> - </p>
                            <input 
                                placeholder="Máximo" 
                                type="number" 
                                step="0.01" 
                                value={maxPrice} 
                                onChange={(e) => setMaxPrice(e.target.value)} 
                            />
                        </S.Pricing>
                    )}
                </div>
                <button onClick={() => handleFilterSearch(1)}>Buscar</button>
              
            </S.ContainerFilter>
            <S.ContainerProduct>
                {products.length > 0 ? (
                    <>
                        {products.map((item, index) => (
                            <S.ProductCard key={index} onClick={() => navigate(`/produto/${item.id}`, { state: { product: item } })}>
                                <img src={handleViewPhoto(item.imagens[0])} alt={item.titulo} />
                                <S.ProductInfo>
                                    <h3>{item.titulo}</h3>
                                    <p>{item.nome_categoria}</p>
                                    <span>R$ {converNumbers(item.valor_original)}</span>
                                </S.ProductInfo>
                            </S.ProductCard>
                        ))}
                        
                        {/* Paginação */}
                        {totalPages > 1 && (
                            <div style={{
                                gridColumn: '1 / -1',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '15px',
                                marginTop: '20px',
                                padding: '20px'
                            }}>
                                <button 
                                    onClick={() => handlePageChange(page - 1)} 
                                    disabled={page === 1}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: page === 1 ? '#ccc' : '#8b2023',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: page === 1 ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    Anterior
                                </button>
                                <span style={{ fontWeight: 'bold' }}>Página {page} de {totalPages}</span>
                                <button 
                                    onClick={() => handlePageChange(page + 1)} 
                                    disabled={page === totalPages}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: page === totalPages ? '#ccc' : '#8b2023',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: page === totalPages ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    Próxima
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div style={{ padding: '20px', gridColumn: '1 / -1', textAlign: 'center' }}>
                        <h3>
                            {searchTerm 
                                ? `Nenhum resultado encontrado para "${searchTerm}"`
                                : "Nenhum produto encontrado com os filtros selecionados."}
                        </h3>
                    </div>
                )}
            </S.ContainerProduct>

           </S.Container>
        
        </>
    )
}

export default Catalogo