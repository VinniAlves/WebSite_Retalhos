import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1rem;
    width: 100%;
`;


export const Search = styled.div`
    display: flex;
    flex-direction: row;
    height: 6rem;
    gap: 5rem;
    align-items: center;
    width: 100%;
    justify-content: center;

    @media screen and (max-width: 1200px) {
        justify-content: space-between;
        padding: 0 2rem;
        margin-bottom: 1rem;
        gap: 0;
        box-sizing: border-box;
    }
`;

export const Logo = styled.img`
    width: 14rem;
    height: 5rem;
`;

export const InputSearch = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    width: 50rem;
    height: 3.5rem;
    border: 2px solid #eaeceb;
    border-radius: 5px;
    padding-left: 0.75rem;

    @media screen and (max-width: 1200px) {
        display: none;
    }
`;


export const InputCamp = styled.input`
        width: 100%;
        height: 3rem;
        border: none;
        outline: none;
        font-size: 15px;
`;


export const ButtonSearch = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 3.5rem;
    background-color: #c93034;
    justify-content: center;
    align-items: center;
    gap: 2rem;

    > button {
        height: 100%;
        width: 100%;
        background-color: transparent;
        border: none;
        color: #fff;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        max-width: 10rem;
        font-size: 15px;
        &:hover {
            border-bottom: 5px solid #fff;
        }
    }
    
    @media screen and (max-width: 1200px) {
        display: none;
    }
`;

    export const MobileMenuButton = styled.div`
    display: none;
    background: transparent;
    cursor: pointer;
    padding: 0.5rem;
    z-index: 10;
    
    @media screen and (max-width: 1200px) {
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

export const MobileMenu = styled.div<{ isOpen: boolean }>`
    display: none;

    @media screen and (max-width: 1200px) {
        display: ${({ isOpen }) => isOpen ? 'flex' : 'none'};
        flex-direction: column;
        width: 100%;
        background-color: #fcfcfc;
        padding: 2rem;
        gap: 1.5rem;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        animation: slideDown 0.3s ease-out;
        box-sizing: border-box;
    }

    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-15px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

export const MobileInputSearch = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    width: 100%;
    height: 3.5rem;
    border: 2px solid #eaeceb;
    border-radius: 5px;
    padding-left: 0.75rem;
    background-color: #fff;
    box-sizing: border-box;

    input {
        width: 100%;
        height: 3rem;
        border: none;
        outline: none;
        font-size: 15px;
    }
`;

export const MobileMenuLinks = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    > button {
        background-color: transparent;
        border: none;
        color: #333;
        font-size: 1.2rem;
        font-weight: 600;
        text-align: left;
        padding: 1rem;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.2s, color 0.2s;

        &:hover {
            background-color: #f0f0f0;
            color: #c93034;
        }
    }
`;
