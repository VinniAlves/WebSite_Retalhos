declare namespace ProdutosInterface {
    type ProductProp = {
        id: number;
        titulo: string;
        descricao: string;
        ano: string;
        codigo: string;
        anuncio_ml: string;
        valor_original: string;
        marca: string;
        modelo: string;
        nome_categoria: string;
        categoria_descricao: string;
        veiculo: string;
        imagens: string[];
    }
    type FormattedProduct = Omit<ProductProp, 'imagens'> & {
        imagens: { id: string, image: string }[];
    }
}
