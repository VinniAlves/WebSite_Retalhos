import styled from "styled-components";

export const Container = styled.div `
    display: flex;
    max-width: 1200px;
    margin: 100px auto 0;
    padding: 2rem;
    gap: 2rem;
`


export const ContainerFilter = styled.div `
    display:flex;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    width: 16rem;
    flex-direction: column;
    background: #fff;
    overflow: hidden;
    height: fit-content;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
`

export const FilterHeaderTop = styled.div `
    background-color: #8b2023;
    color: white;
    padding: 1rem;
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
    gap: 1rem;
    flex: 1;
        height: 0;
`

export const ProductCard = styled.div `
    display: flex;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 0.5rem;
    gap: 1rem;
    background: #fff;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
        height: 7rem;


    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    img {
        width: 100px;
        height: 100px;
        border-radius: 8px;
        object-fit: cover;
        background: #f5f5f5;
    }
`

export const ProductInfo = styled.div `
    display: flex;
    flex-direction: column;
    justify-content: center;

    h3 {
        font-size: 0.95rem;
        margin: 0 0 0.5rem 0;
        color: #333;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    p {
        font-size: 0.8rem;
        color: #888;
        margin: 0 0 0.5rem 0;
    }

    span {
        font-size: 1rem;
        font-weight: bold;
        color: #8b2023;
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