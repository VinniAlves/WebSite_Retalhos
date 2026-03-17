import * as S from "./styles";
import logo from '../../assets/image/Logo.png'
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import mercadolibre from '../../assets/image/mercadolibre.svg'

function Footer() {
    return (
        <S.Container>
            <S.ContainerImg>
                <img src={logo} alt="" />
            </S.ContainerImg>
            <S.ContainerInfoContact>
                <h2>CANAIS DE ATENDIMENTO</h2>
                <S.WhatsAppLink href="https://wa.me/5545999870968" target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon />
                    <h3>Whatsapp: (45) 99987-0968</h3>
                </S.WhatsAppLink>

            </S.ContainerInfoContact>
            <S.ContainerStorage>
                <h2>COMPRE COM SEGURANÇA</h2>
                <a href='https://lista.mercadolivre.com.br/_CustId_1131399814'>
                    <img src={mercadolibre} alt="" />
                </a>
            </S.ContainerStorage>

        </S.Container>
    )
}

export default Footer