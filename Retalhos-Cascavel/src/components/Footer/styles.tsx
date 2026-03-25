import styled from "styled-components";

export const Container = styled.footer`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    min-height: 15rem;
    background-color: #8b2023;
    color: white;
    padding: 2rem;
    gap: 2rem;

    @media (max-width: 1200px) {
        flex-direction: column;
        text-align: center;
        padding: 3rem 1rem;
    }
`;

export const ContainerImg = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;

    img {
        width: 18rem;
        max-width: 100%;
        object-fit: contain;

        @media (max-width: 1200px) {
            width: 15rem;
        }
    }
`;

export const ContainerInfoContact = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    h2 {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        letter-spacing: 0.05em;
    }
`;

export const WhatsAppLink = styled.a`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 0.8rem;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
    cursor: pointer;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.05);

    &:hover {
        background-color: rgba(37, 211, 102, 0.1);
        color: #25D366;
        
        svg {
            color: #25D366;
            fill: #25D366;
        }
    }

    h3 {
        font-weight: 500;
        margin: 0;
        font-size: 1.1rem;
    }
`;

export const ContainerStorage = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;  
    gap: 1rem;

    h2 {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        letter-spacing: 0.05em;
    }

    a {
        transition: transform 0.3s ease;
        &:hover {
            transform: scale(1.05);
        }
    }

    img {
        width: 12rem;
        max-width: 100%;
        object-fit: contain;
    }
`;