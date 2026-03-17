import logo from '../../assets/image/Logo.png'
import * as S from "./styles";
import SearchIcon from '@mui/icons-material/Search';

const buttonsSearch = [
    {
        name: "Alma"
    },
    {
        name: "Alojamento Farol"
    },
    {
        name: "Caixa de AR"
    },
    {
        name: "Colunas"
    },
    {
        name: "Laterais"
    },

    {
        name: "Paralamas"
    },
    {
        name: "Outros"
    },
]



function Header() {
    return (
        <S.Container>
            <S.Search>
                <S.Logo src={logo} alt="" />
                
                <S.InputSearch>
                    <SearchIcon style={{ color: "#cfcfcfff" }} />
                    <S.InputCamp type="text" placeholder="Buscar peça.." />
                </S.InputSearch>
                
            </S.Search>
            <S.ButtonSearch>
                {
                    buttonsSearch.map((button, index) => (
                        <button key={index}>{button.name}</button>
                    ))
                }
            </S.ButtonSearch>
        </S.Container>
    )
}

export default Header