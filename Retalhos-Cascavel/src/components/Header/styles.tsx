import styled from 'styled-components';


export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1rem;

`

export const Logo = styled.img`
    width: 23%;
    height: 5rem;
`
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
`


export const InputCamp = styled.input`
        width: 100%;
        height: 3rem;
        border: none;
        outline: none;
        font-size: 15px;
`
export const Search = styled.div`
    display: flex;
    flex-direction: row;
    height: 6rem;
    gap: 5rem;
    align-items: center;

`

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
        background-color: #c93034;;
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
`
