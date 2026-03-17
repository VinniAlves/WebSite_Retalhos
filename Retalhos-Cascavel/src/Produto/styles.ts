import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
    margin-top: 100px;
`;

export const MainContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;

    @media (min-width: 768px) {
        flex-direction: row;
    }
`;

export const ImagesSection = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

export const MainImage = styled.img`
    width: 100%;
    max-width: 500px;
    height: auto;
    border-radius: 8px;
    object-fit: cover;
    border: 1px solid #ccc;
`;

export const ThumbnailsContainer = styled.div`
    display: flex;
    gap: 1rem;
    overflow-x: auto;
`;

export const Thumbnail = styled.img<{ active?: boolean }>`
    width: 80px;
    height: 80px;
    border-radius: 8px;
    object-fit: cover;
    cursor: pointer;
    border: 2px solid ${({ active }) => (active ? "#8b2023" : "#ccc")};
    transition: all 0.2s ease;

    &:hover {
        border-color: #8b2023;
    }
`;

export const InfoSection = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

export const Title = styled.h1`
    font-size: 1.8rem;
    color: #333;
    margin: 0;
`;

export const Price = styled.h2`
    font-size: 2rem;
    color: #000;
    margin: 0;
    font-weight: bold;
`;

export const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

export const WppButton = styled.a`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background-color: #25D366;
    color: #fff;
    padding: 12px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: bold;
    font-size: 1.1rem;
    transition: filter 0.2s;

    &:hover {
        filter: brightness(0.9);
    }
`;

export const MLButton = styled.a`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background-color: #FFE600;
    color: #333;
    padding: 12px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: bold;
    font-size: 1.1rem;
    transition: filter 0.2s;

    &:hover {
        filter: brightness(0.9);
    }
`;

export const StockInfo = styled.p`
    color: #28a745;
    font-size: 0.9rem;
    margin: 0;
`;

export const DescriptionSection = styled.div`
    margin-top: 3rem;
`;

export const SectionTitle = styled.h3`
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 1rem;
    text-transform: uppercase;
`;

export const DescriptionText = styled.p`
    font-size: 1rem;
    color: #555;
    line-height: 1.6;
`;

export const RelatedSection = styled.div`
    margin-top: 3rem;
    margin-bottom: 3rem;
`;

export const CarrocelContent = styled.div`
    display: flex;
    gap: 20px;
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 2rem;
    
    &::-webkit-scrollbar {
        height: 8px;
    }
    &::-webkit-scrollbar-track {
        background: #f1f1f1; 
        border-radius: 8px;
    }
    &::-webkit-scrollbar-thumb {
        background: #888; 
        border-radius: 8px;
    }
    &::-webkit-scrollbar-thumb:hover {
        background: #555; 
    }
`;

export const CarrocelItem = styled.div`
    min-width: 250px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
        transform: translateY(-5px);
    }

    img {
        width: 100%;
        height: 150px;
        object-fit: cover;
    }
`;

export const DivText = styled.div`
    padding: 15px;

    h2 {
        font-size: 1rem;
        margin-bottom: 10px;
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    div {
        display: flex;
        justify-content: space-between;
        align-items: center;

        p {
            font-size: 0.9rem;
            color: #666;
            margin: 0;
        }
    }
`;
