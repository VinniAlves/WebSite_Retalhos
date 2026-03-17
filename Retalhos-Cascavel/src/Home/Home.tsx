import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Hearder"
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Container } from "./styles"
import backgroundImgOne from "../assets/image/backgroundTakeOne.svg"
import backgroundImgTwo from "../assets/image/backgroundTakeTwo.svg"
import Cash from '../assets/image/Cash.svg'
import Leteral from '../assets/image/Leteral.svg'
import Transport from '../assets/image/Transport.svg'
import Footer from "../components/Footer/Footer"
import * as S from "./styles";
import carrocel from "../mock.json";

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
                    {carrocel.carrocel.map((item, index) => (
                        <S.CarrocelItem key={index} onClick={() => navigate(`/produto/${item.idProduto}`)} style={{ cursor: 'pointer' }}>
                            <img src={item.imgurl} alt="" />
                            <S.DivText>
                                <h2>{item.title}</h2>
                                <div>
                                    <p>{item.type}</p>
                                    <p style={{color: "#8b2023", fontWeight: "bold" }}>{item.price}</p>
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