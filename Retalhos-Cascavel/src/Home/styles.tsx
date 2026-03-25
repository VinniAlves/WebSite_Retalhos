import styled from "styled-components";


export const Container = styled.div`
   h1 {
    text-align: center;
    margin-top: 2rem;
    font-size: 3rem;
   }

`;

export const background = styled.div`
    width: 100%;
    height: 70vh; 
    position: relative;
    overflow: hidden;

    .carousel-content {
        width: 100%;
        height: 100%;
        position: relative;

        img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0;
            transition: opacity 1s ease-in-out;
            
            &.active {
                opacity: 1;
            }
        }
    }

    .nav-button {
        position: absolute;
        top: 50%;
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
            left: 2rem;
            padding-left: 8px; /* Offset for better visual center of ArrowBack */
        }

        &.next {
            right: 2rem;
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

    img {
        width: 5rem;
        height: 5rem;
    }
`;

export const BodyPageDescription = styled.div` 
        display: flex;
        justify-content: center;
        align-items: center;
        width: 20%;
        height: 100%;
        flex-direction: row;
        gap:2rem;
`;

export const DivText = styled.div`
    display: flex;
    flex-direction: column;
    height: 80%;
    width: 60%;
    justify-content: space-between;
    
    h2{
    margin: 0;
    }
    p{
    margin: 0;
    }
    div{
        font-size: 1.1rem;
    
    }
`;

export const Carrocel = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
`;

export const CarrocelContent = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 76%;
    height: 100%;
    flex-wrap: wrap;
    gap:1rem;
    margin-bottom: 2rem;
    max-width: 120rem;
    
`;

export const CarrocelItem = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 28rem;
    height: 9rem;
    border: 1px solid #ccc;
    border-radius: 1rem;
    gap:1rem;
    padding: 10px;
    transition: transform 0.2s, box-shadow 0.2s;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    img{
        max-width: 16rem;
        max-height: 16rem;
        border-radius: 1rem;
    }
        h2{
            font-size: 1rem;
        }
`;
