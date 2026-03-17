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
    padding: 1rem;
    width: 16rem;
    flex-direction: column;
    background: #fff;
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
    display:flex;

    input{
        width: 5rem;
        height: 2rem;
    }
`

export const FilterHeader = styled.h2`
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    user-select: none;

    &:hover {
        color: #666;
    }
`