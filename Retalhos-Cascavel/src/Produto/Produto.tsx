import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import HandshakeIcon from '@mui/icons-material/Handshake';
import * as S from "./styles";


function Produto() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const formatProduct = (p: any): ProdutosInterface.FormattedProduct | null => {
        if (!p) return null;
        // Se já estiver formatado (mock), retorna como está
        if (p.imagens && p.imagens.length > 0 && typeof p.imagens[0] === 'object') {
            return p as ProdutosInterface.FormattedProduct;
        }
        // Se imagens for um array de strings (API), converte para array de objetos esperado pelo template
        if (p.imagens && p.imagens.length > 0 && typeof p.imagens[0] === 'string') {
            return {
                ...p,
                imagens: p.imagens.map((img: string, idx: number) => ({
                    id: String(idx),
                    image: img.startsWith('http') ? img : `http://localhost:8080/retalhos.cascavel${img}`
                }))
            };
        }
        // Se for um array vazio ou outro caso, garante que imagens é um array de objetos
        return { ...p, imagens: [] } as ProdutosInterface.FormattedProduct;
    };

    const [produto, setProduto] = useState<ProdutosInterface.FormattedProduct | null>(formatProduct(location.state?.product));
    const [mainImage, setMainImage] = useState<string>("");
    const [produtosRelacionados, setProdutosRelacionados] = useState<ProdutosInterface.ProductProp[]>([]);

    useEffect(() => {
        let currentProduct = produto;
        // if (!currentProduct) {
        //     // Find product by id
        //     const foundProduto = mock.carrocel.find((item) => item.idProduto === id || String((item as any).id) === id);
        //     if (foundProduto) {
        //         currentProduct = formatProduct(foundProduto);
        //         setProduto(currentProduct);
        //     }
        // }
        
        if (currentProduct) {
             if (currentProduct.imagens && currentProduct.imagens.length > 0) {
                 setMainImage(currentProduct.imagens[0].image);
             }
        }
        window.scrollTo(0, 0);
    }, [id, produto]);

    if (!produto) return <S.Container><h2>Produto não encontrado</h2></S.Container>;

    // // Filter related products (for example, same type but different id)
    // const relacioandos = mock.carrocel.filter(item => String(item.idProduto) !== String(id)).slice(0, 4);

    useEffect(() => {
        const url = `http://localhost:8080/retalhos.cascavel/products/related/${id}`;

        const fetchProducts = async () => {
            try {
                const response = await fetch(url,{
                    method: 'POST',
                });
                
                if(!response.ok){
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                const data = await response.json();
                setProdutosRelacionados(data);

            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
            }
        };
        fetchProducts();
    }, []);


    return (
        <S.Container>
            <S.MainContent>
                <S.ImagesSection>
                    <S.MainImage src={mainImage} alt={produto.titulo} />
                    {produto.imagens && produto.imagens.length > 0 && (
                        <S.ThumbnailsContainer>
                            {produto.imagens.map((img: any) => (
                                <S.Thumbnail 
                                    key={img.id} 
                                    src={img.image} 
                                    alt="thumbnail"
                                    active={mainImage === img.image}
                                    onClick={() => setMainImage(img.image)}
                                />
                            ))}
                        </S.ThumbnailsContainer>
                    )}
                </S.ImagesSection>

                <S.InfoSection>
                    <S.Title>{produto.titulo}</S.Title>
                    <S.Price>{produto.valor_original}</S.Price>
                    
                    <S.ButtonContainer>
                        <S.WppButton href={`https://wa.me/5545999870968?text=Olá, tenho interesse no produto: ${produto.titulo} - Código: ${produto.codigo}`} target="_blank" rel="noopener noreferrer">
                            <WhatsAppIcon /> Falar no WhatsApp
                        </S.WppButton>
                        <S.MLButton href={produto.anuncio_ml} target="_blank" rel="noopener noreferrer">
                            <HandshakeIcon /> Comprar no Mercado Livre
                        </S.MLButton>
                    </S.ButtonContainer>

                    <S.StockInfo>Em estoque. Envio imediato.</S.StockInfo>
                </S.InfoSection>
            </S.MainContent>

            <S.DescriptionSection>
                <S.SectionTitle>DESCRIÇÃO DO PRODUTO</S.SectionTitle>
                <S.DescriptionText>{produto.descricao}</S.DescriptionText>
            </S.DescriptionSection>

            <S.RelatedSection>
                <S.SectionTitle>PEÇAS RELACIONADAS</S.SectionTitle>
                <S.CarrocelContent>
                    {produtosRelacionados.map((item, index) => (
                        <S.CarrocelItem key={index} onClick={() => {
                            navigate(`/produto/${item.id}`, { state: { product: item } });
                            setProduto(formatProduct(item));
                            window.scrollTo(0, 0);
                        }}>
                            <img src={item.imagens && item.imagens.length > 0 ? (item.imagens[0].startsWith('http') ? item.imagens[0] : `http://localhost:8080/retalhos.cascavel${item.imagens[0]}`) : ""} alt={item.titulo} />
                            <S.DivText>
                                <h2>{item.titulo}</h2>
                                <div>
                                    <p>{item.categoria_descricao}</p>
                                    <p style={{ color: "#8b2023", fontWeight: "bold" }}>{item.valor_original}</p>
                                </div>
                            </S.DivText>
                        </S.CarrocelItem>
                    ))}
                </S.CarrocelContent>
            </S.RelatedSection>
        </S.Container>
    );
}

export default Produto;
