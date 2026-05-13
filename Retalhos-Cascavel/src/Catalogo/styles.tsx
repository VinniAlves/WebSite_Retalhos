import styled from "styled-components";

export const Container = styled.div `
    display: flex;
    max-width: 1200px;
    margin: 100px auto 0;
    padding: 2rem;
    gap: 2rem;

    @media (max-width: 1024px) {
        flex-direction: column;
        padding: 1rem;
        margin-top: 20px;
    }
`


export const ContainerFilter = styled.div<{ isOpen?: boolean }> `
    display:flex;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    width: 16rem;
    flex-direction: column;
    background: #fff;
    overflow: hidden;
    height: fit-content;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);

    @media (max-width: 1024px) {
        display: ${({ isOpen }) => isOpen ? 'flex' : 'none'};
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2000;
        border-radius: 0;
        border: none;
        overflow-y: auto;
    }
`

export const FilterHeaderTop = styled.div `
    background-color: #8b2023;
    color: white;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
        margin: 0;
        font-size: 1.25rem;
    }
`

export const FilterBody = styled.div `
    padding: 1rem;
    display: flex;
    flex-direction: column;
`


export const Divider = styled.div `
    border: 1px solid #e0e0e0;
    width: 100%;
    height: 0px;
    margin: 1rem 0;
`

export const ContainerProduct = styled.div `
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    flex: 1;
    align-content: start;

    @media (max-width: 1100px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 650px) {
        grid-template-columns: 1fr;
    }
`

export const ProductCard = styled.div `
    display: flex;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 0.8rem;
    gap: 1rem;
    background: #fff;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    min-height: 8rem;
    height: fit-content;
    align-items: center;



    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    img {
        width: 110px;
        height: 110px;
        border-radius: 8px;
        object-fit: cover;
        background: #f5f5f5;
        flex-shrink: 0;
    }

    @media (max-width: 400px) {
        flex-direction: column;
        min-height: auto;
        
        img {
            width: 100%;
            height: 180px;
        }
    }
`

export const ProductInfo = styled.div `
    display: flex;
    flex-direction: column;
    flex: 1;

    h3 {
        font-size: 1rem;
        margin: 0 0 0.5rem 0;
        color: #333;
        font-weight: 600;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    p {
        font-size: 0.85rem;
        color: #666;
        margin: 0 0 0.2rem 0;
    }

    span {
        font-size: 1.1rem;
        font-weight: 700;
        color: #8b2023;
        margin-top: 0.5rem;
    }
`

export const Pricing = styled.div `
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-top: 0.5rem;

    input {
        width: 100%;
        height: 2.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 0.5rem;
        outline: none;
        transition: border-color 0.2s;

        &:focus {
            border-color: #8b2023;
        }
    }
    
    p {
        margin: 0;
        font-weight: bold;
        color: #666;
    }
`;

export const FilterHeader = styled.h2`
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.1rem;
    margin-bottom: 0.8rem;
    user-select: none;
    color: #333;
    transition: color 0.2s;

    &:hover {
        color: #8b2023;
    }
`;

export const CheckboxLabel = styled.label`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.6rem;
    cursor: pointer;
    font-size: 0.95rem;
    color: #444;

    input[type="checkbox"] {
        accent-color: #8b2023;
        width: 1rem;
        height: 1rem;
        cursor: pointer;
    }
    
    &:hover {
        color: #8b2023;
    }
`;

export const SearchButton = styled.button`
    background-color: #8b2023;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.8rem;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    width: 100%;
    margin-top: 1.5rem;
    transition: background-color 0.3s, transform 0.1s;

    &:hover {
        background-color: #6a181a;
    }

    &:active {
        transform: scale(0.98);
    }
`;

export const MobileFilterToggle = styled.button`
    display: none;
    background-color: #fff;
    color: #333;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 0.8rem 1rem;
    font-weight: 600;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    cursor: pointer;
    width: 100%;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);

    @media (max-width: 1024px) {
        display: flex;
    }

    svg {
        color: #8b2023;
    }
`;

export const CloseButton = styled.button`
    display: none;
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0.5rem;

    @media (max-width: 1024px) {
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;
