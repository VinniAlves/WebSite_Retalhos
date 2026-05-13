import * as S from "./styles";
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import converNumbers from "../utils/ConvertNumbers";
import { getApiBase, imageUrlFromPath } from "../config/env";
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';


interface Categoria {
    id: number;
    nome_categoria: string;
}

interface Marca {
    id: number;
    marca: string;
}

interface Veiculo {
    id: number;
    veiculo: string;
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
    const [isOpenVeiculo, setIsOpenVeiculo] = useState(true);
    const [isOpenPreco, setIsOpenPreco] = useState(true);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Filter Data States
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [marcas, setMarcas] = useState<Marca[]>([]);
    const [veiculos, setVeiculos] = useState<Veiculo[]>([]);

    // Selected Filters States
    const [selectedCategorias, setSelectedCategorias] = useState<number[]>(location.state?.selectedCategorias || []);
    const [selectedMarcas, setSelectedMarcas] = useState<number[]>([]);
    const [selectedVeiculos, setSelectedVeiculos] = useState<number[]>([]);
    const [minPrice, setMinPrice] = useState<string>("");
    const [maxPrice, setMaxPrice] = useState<string>("");
    
    // Pagination State
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const handleFilterSearch = useCallback(async (currentPage = 1) => {
        try {
            setIsMobileFilterOpen(false);
            const bodyData = {
                categoria: selectedCategorias.length > 0 ? selectedCategorias : undefined,
                marca: selectedMarcas.length > 0 ? selectedMarcas : undefined,
                veiculo: selectedVeiculos.length > 0 ? selectedVeiculos : undefined,
                minPrice: minPrice ? parseFloat(minPrice) : undefined,
                maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
                page: currentPage
            };

            const response = await fetch(`${getApiBase()}/products/filter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'

                },
                body: JSON.stringify(bodyData)
            });

            if (!response.ok) {
               const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
            }

            const data = await response.json();
            setProducts(data.products || []);
            setSearchTerm(""); 
            if (data.pagination) {
                setPage(data.pagination.currentPage);
                setTotalPages(data.pagination.totalPages);
            }
        } catch (error) {
            console.error("Erro ao filtrar produtos:", error);
        }
    }, [selectedCategorias, selectedMarcas, selectedVeiculos, minPrice, maxPrice]);

    const isClearingState = useRef(false);
    
    useEffect(() => {
        if (isClearingState.current) {
            isClearingState.current = false;
            return;
        }

        let shouldFetchAll = true;

        if (location.state?.products) {
            shouldFetchAll = false;
            setProducts(location.state.products);
            
            if (location.state?.pagination) {
                setPage(location.state.pagination.currentPage);
                setTotalPages(location.state.pagination.totalPages);
            }
            if (location.state?.selectedCategorias) {
                setSelectedCategorias(location.state.selectedCategorias);
            }
        } 
        
        if (location.state?.searchTerm) {
            shouldFetchAll = false;
            setSearchTerm(location.state.searchTerm);
        }

        if (shouldFetchAll && !location.state) {
            // Se não tem produtos no state e não há termo de busca, faz fetch inicial limpo
            handleFilterSearch(1);
        }

        // Limpa o location.state para que ao recarregar a página (F5) 
        // não segure os filtros antigos, mas marcamos que estamos limpando.
        if (location.state) {
            isClearingState.current = true;
            navigate(location.pathname, { replace: true, state: null });
        }
    }, [location.pathname, location.state, navigate, handleFilterSearch]);

    // Fetch Categorias and Marcas on mount
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [catRes, marRes, veiRes] = await Promise.all([
                    fetch(`${getApiBase()}/category`),
                    fetch(`${getApiBase()}/mark`),
                    fetch(`${getApiBase()}/vehicle`)
                ]);
                
                if (catRes.ok) {
                    const catData = await catRes.json();
                    setCategorias(catData.map((c: any) => ({ id: c.id, nome_categoria: c.nome_categoria })));
                }
                
                if (marRes.ok) {
                    const marData = await marRes.json();
                    setMarcas(marData.map((m: any) => ({ id: m.id, marca: m.marca })));
                }

                if (veiRes.ok) {
                    const veiData = await veiRes.json();
                    setVeiculos(veiData.map((v: any) => ({ id: v.id, veiculo: v.veiculo })));
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

    const handleCheckboxVeiculo = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
        if (event.target.checked) {
            setSelectedVeiculos(prev => [...prev, value]);
        } else {
            setSelectedVeiculos(prev => prev.filter(id => id !== value));
        }
    };

    const handleViewPhoto = (image: string) => {
        return imageUrlFromPath(image);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            handleFilterSearch(newPage);
        }
    };

    return (
        <>
           <S.Container>
            <S.MobileFilterToggle onClick={() => setIsMobileFilterOpen(true)}>
                <FilterListIcon /> Filtrar Produtos
            </S.MobileFilterToggle>

            <S.ContainerFilter isOpen={isMobileFilterOpen}> 
                <S.FilterHeaderTop>
                    <h2>Filtros</h2>
                    <S.CloseButton onClick={() => setIsMobileFilterOpen(false)}>
                        <CloseIcon />
                    </S.CloseButton>
                </S.FilterHeaderTop>
                
                <S.FilterBody>
                    <div>
                        <form onSubmit={(e) => { e.preventDefault(); handleFilterSearch(1); }}>
                            <S.FilterHeader onClick={() => setIsOpenCategoria(!isOpenCategoria)}>
                                Categoria {isOpenCategoria ? '▲' : '▼'}
                            </S.FilterHeader>
                            {isOpenCategoria && categorias.map((item) => (
                                <S.CheckboxLabel key={item.id}>
                                    <input 
                                        type="checkbox" 
                                        value={item.id} 
                                        onChange={handleCheckboxCategoria} 
                                        checked={selectedCategorias.includes(item.id)}
                                    /> 
                                    {item.nome_categoria}
                                </S.CheckboxLabel>
                            ))}
                                <S.Divider/>
                            <S.FilterHeader onClick={() => setIsOpenMarca(!isOpenMarca)}>
                                Marca {isOpenMarca ? '▲' : '▼'}
                            </S.FilterHeader>
                            {isOpenMarca && marcas.map((item) => (
                                <S.CheckboxLabel key={item.id}>
                                    <input 
                                        type="checkbox" 
                                        value={item.id} 
                                        onChange={handleCheckboxMarca} 
                                        checked={selectedMarcas.includes(item.id)}
                                    /> 
                                    {item.marca}
                                </S.CheckboxLabel>
                            ))}
                                <S.Divider/>
                            <S.FilterHeader onClick={() => setIsOpenVeiculo(!isOpenVeiculo)}>
                                Veículo {isOpenVeiculo ? '▲' : '▼'}
                            </S.FilterHeader>
                            {isOpenVeiculo && veiculos.map((item) => (
                                <S.CheckboxLabel key={item.id}>
                                    <input 
                                        type="checkbox" 
                                        value={item.id} 
                                        onChange={handleCheckboxVeiculo} 
                                        checked={selectedVeiculos.includes(item.id)}
                                    /> 
                                    {item.veiculo}
                                </S.CheckboxLabel>
                            ))}
                        </form>
                     </div>
                    <S.Divider/>
                    <S.FilterHeader onClick={() => setIsOpenPreco(!isOpenPreco)}>
                        Preço {isOpenPreco ? '▲' : '▼'}
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
                    <S.SearchButton onClick={() => handleFilterSearch(1)}>Buscar</S.SearchButton>
                </S.FilterBody>
            </S.ContainerFilter>
            <S.ContainerProduct>
                {products.length > 0 ? (
                    <>
                        {products.map((item, index) => (
                            <S.ProductCard key={index} onClick={() => navigate(`/produto/${item.id}`, { state: { product: item } })}>
                                <img src={handleViewPhoto(item.imagens[0])} alt={item.titulo} />
                                <S.ProductInfo>
                                    <div>
                                        <h3>{item.titulo}</h3>
                                        <p>{item.nome_categoria}</p>
                                        <p style={{fontWeight: "bold", color: "#000000ff" }}>{item.veiculo}</p>
                                    </div>
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