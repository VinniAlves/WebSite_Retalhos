import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import HandshakeIcon from '@mui/icons-material/Handshake';
import * as S from "./styles";
import mock from "../mock.json";

function Produto() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [produto, setProduto] = useState<any>(null);
    const [mainImage, setMainImage] = useState<string>("");

    useEffect(() => {
        // Find product by id
        const foundProduto = mock.carrocel.find((item) => item.idProduto === id);
        if (foundProduto) {
            setProduto(foundProduto);
            if (foundProduto.imagens && foundProduto.imagens.length > 0) {
                setMainImage(foundProduto.imagens[0].image);
            } else {
                setMainImage(foundProduto.imgurl);
            }
        }
        window.scrollTo(0, 0);
    }, [id]);

    if (!produto) return <S.Container><h2>Produto não encontrado</h2></S.Container>;

    // Filter related products (for example, same type but different id)
    const relacioandos = mock.carrocel.filter(item => item.idProduto !== id).slice(0, 4);

    return (
        <S.Container>
            <S.MainContent>
                <S.ImagesSection>
                    <S.MainImage src={mainImage} alt={produto.title} />
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
                    <S.Title>{produto.title}</S.Title>
                    <S.Price>{produto.price}</S.Price>
                    
                    <S.ButtonContainer>
                        <S.WppButton href={produto.linkWpp} target="_blank" rel="noopener noreferrer">
                            <WhatsAppIcon /> Falar no WhatsApp
                        </S.WppButton>
                        <S.MLButton href={produto.linkML} target="_blank" rel="noopener noreferrer">
                            <HandshakeIcon /> Comprar no Mercado Livre
                        </S.MLButton>
                    </S.ButtonContainer>

                    <S.StockInfo>Em estoque. Envio imediato.</S.StockInfo>
                </S.InfoSection>
            </S.MainContent>

            <S.DescriptionSection>
                <S.SectionTitle>DESCRIÇÃO DO PRODUTO</S.SectionTitle>
                <S.DescriptionText>{produto.description}</S.DescriptionText>
            </S.DescriptionSection>

            <S.RelatedSection>
                <S.SectionTitle>PEÇAS RELACIONADAS</S.SectionTitle>
                <S.CarrocelContent>
                    {relacioandos.map((item, index) => (
                        <S.CarrocelItem key={index} onClick={() => navigate(`/produto/${item.idProduto}`)}>
                            <img src={item.imgurl} alt={item.title} />
                            <S.DivText>
                                <h2>{item.title}</h2>
                                <div>
                                    <p>{item.type}</p>
                                    <p style={{ color: "#8b2023", fontWeight: "bold" }}>{item.price}</p>
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
