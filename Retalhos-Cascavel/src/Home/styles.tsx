import styled from "styled-components";

export const Container = styled.div`
   h1 {
    text-align: center;
    margin-top: 2rem;
    margin-bottom: 4rem;
    font-size: 3rem;
   }
`;

export const background = styled.div`
    width: 100%;
    height: 40rem; 
    position: relative;
    overflow: hidden;

    @media (max-width: 500px) {
        display: none;
    }

    .carousel-content {
        width: 100%;
        height: 100%;
        max-height: 45rem;
        position: relative;

        img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 80%;
            object-fit: cover;
            opacity: 0;
            transition: opacity 1s ease-in-out; 
            transform: translate(0, -4rem);
            height: 100%;
            
            &.active {
                opacity: 1;
            }
        }
    }

    .nav-button {
        position: absolute;
        top: 40%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.3);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        z-index: 10;
        transition: background 0.3s;

        &:hover {
            background: rgba(0, 0, 0, 0.6);
        }

        &.prev {
            left: 4rem;
            padding-left: 8px; 
        }

        &.next {
            right: 4rem;
        }

        svg {
            font-size: 24px;
        }
    }
`;

export const BodyPage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-bottom: 4rem;
    
    img {
        width: 5rem;
        height: 5rem;
    }
    
    @media screen and (max-width: 1400px) {
        flex-direction: column;
        gap: 2rem;
    }
`;

export const BodyPageDescription = styled.div` 
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        flex-direction: row;
        gap: 2rem;
`;

export const DivText = styled.div`
    display: flex;
    flex-direction: column;
    height: auto;
    min-height: 7rem;
    width: 16rem;
    max-width: 100%;
    gap: 5px;
    flex: 1;
    justify-content: center;
    
    h2 {
        margin: 0;
        font-size: 1rem;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    p {
        margin: 0;
        font-size: 0.9rem;
    }
    div {
        font-size: 1.1rem;
        margin-top: auto;
    }

    @media (max-width: 500px) {
        width: 100%;
        height: auto;
        min-height: auto;
        max-width: 12rem;
    }
`;

export const Carrocel = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    margin-bottom: 4rem;
`;

export const CarrocelContent = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 76%;
    height: 100%;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 2rem;
    max-width: 120rem;
    
    @media (max-width: 1200px) {
        width: 90%;
    }

    @media (max-width: 768px) {
        width: 95%;
    }
`;

export const CarrocelItem = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 28rem;
    max-width: 100%;
    height: 9rem;
    border: 1px solid #ccc;
    border-radius: 1rem;
    gap: 1rem;
    padding: 10px;
    transition: transform 0.2s, box-shadow 0.2s;
    box-sizing: border-box;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    img {
        width: 8rem;
        height: 8rem;
        object-fit: cover;
        border-radius: 0.5rem;
        flex-shrink: 0;
    }

    @media (max-width: 500px) {
        width: 100%;
        height: auto;
        min-height: 9rem;
        gap: 0.8rem;
        padding: 0.8rem;
        
        img {
            width: 7rem;
            height: 7rem;
        }
    }
`;
