import styled from "styled-components";


export const Container = styled.div`
    display: flex;
    width: 100%;
    height: 15rem;
    background-color: #8b2023;
    color:white;
    div{
    }
`;

export const ContainerImg = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
   
    width: 40%;
    height: 100%;

    img{
        width: 20rem;
    }
`;

export const ContainerInfoContact = styled.div`
    display: flex;
    
    width: 40%;
    height: 100%;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    

    div{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap:1rem;
        width: 100%;
    }
`;

export const WhatsAppLink = styled.a`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
        color: #25D366;
        
        svg {
            color: #25D366;
            fill: #25D366;
        }
    }

    h3 {
        font-weight: 500;
        margin: 0;
    }
`;


export const ContainerStorage = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;  
    width: 40%;
    height: 100%;


    img{
        width: 15rem;
        height: 10rem;
    }
`;