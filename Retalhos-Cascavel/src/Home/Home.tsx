import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Container } from "./styles"
import backgroundImgOne from "../assets/image/backgroundTakeOne.svg"
import backgroundImgTwo from "../assets/image/backgroundTakeTwo.svg"
import Cash from '../assets/image/Cash.svg'
import Leteral from '../assets/image/Leteral.svg'
import Transport from '../assets/image/Transport.svg'
import * as S from "./styles";
import converNumbers from "../utils/ConvertNumbers";


const background = [
    {
        img: backgroundImgOne
    },
    {
        img: backgroundImgTwo
    }
]

const bodyPageDescription = [
    {
        img: Cash,
        title: "ECONOMIA GARANTIDA",
        description: "Peças originais por um fração do preço de novas"
    },
    {
        img: Leteral,
        title: "QUALIDADE ORIGINAL",
        description: " Peças genuinas que garantem encaixe e durabilidade"
    },
    {
        img: Transport,
        title: "ENTREGA RÁPIDA",
        description: "Estoque pronto e envio seguro"
    }
]




function Home() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();
    const [products, setProducts] = useState<ProdutosInterface.ProductProp[]>([]);

    const nextImage = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % background.length);
    }, []);

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + background.length) % background.length);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextImage();
        }, 10000);

        return () => clearInterval(interval);
    }, [nextImage]);

    useEffect(() => {
        const url = 'http://localhost:8080/retalhos.cascavel/products/filter';
        const bodyRow = {
            destaque: true
        }

        const fetchProducts = async () => {
            try {
                const response = await fetch(url,{
                    method: 'POST',
                    body: JSON.stringify(bodyRow),
                    headers:{
                        'Content-Type': 'application/json'
                    }
                });
                
                if(!response.ok){
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                const data = await response.json();
                setProducts(data.products);

            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
            }
        };
        fetchProducts();
    }, []);

    const HandleViewPhoto = useCallback((image:string)=>{
            const mergeImage = "http://localhost:8080/retalhos.cascavel"+image
            return mergeImage;
    },[])

    return (
        <Container>
            <S.background>
                <button className="nav-button prev" onClick={prevImage}>
                    <ArrowBackIosIcon />
                </button>

                <div className="carousel-content">
                    {background.map((imagem, index) => (
                        <img
                            key={index}
                            src={imagem.img}
                            alt=""
                            className={index === currentIndex ? 'active' : ''}
                        />
                    ))}
                </div>

                <button className="nav-button next" onClick={nextImage}>
                    <ArrowForwardIosIcon />
                </button>
            </S.background>
            <h1>Por que escolher a Retalhos Cascavel?</h1>
            <S.BodyPage>
                {bodyPageDescription.map((item, index) => (
                    <S.BodyPageDescription key={index}>
                        <img src={item.img} alt="" />
                        <S.DivText>
                            <h2>{item.title}</h2>
                            <p>{item.description}</p>
                        </S.DivText>
                    </S.BodyPageDescription>
                ))}

            </S.BodyPage>
            <S.Carrocel>
                <h1 style={{ fontSize: "2rem" }}>DESTAQUE DA LOJA</h1>
                <S.CarrocelContent>
                    {products.map((item, index) => (
                        <S.CarrocelItem key={index} onClick={() => navigate(`/produto/${item.id}`, { state: { product: item } })} style={{ cursor: 'pointer' }}>
                            <img src={HandleViewPhoto(item.imagens[0])} alt="" />
                            <S.DivText>
                                <h2>{item.titulo}</h2>
                                <div>
                                    <p>{item.nome_categoria}</p>
                                    <p style={{color: "#8b2023", fontWeight: "bold" }}>R$ {converNumbers(item.valor_original)}</p>
                                </div>
                                
                            </S.DivText>
                        </S.CarrocelItem>
                    ))}
            
                </S.CarrocelContent>
            </S.Carrocel>
        </Container>
    )
}

export default Home