declare namespace ProdutosInterface {
    type ProductProp = {
        id: number;
        titulo: string;
        descricao: string;
        ano_inicial: string;
        ano_final: string;
        codigo: string;
        anuncio_ml: string;
        valor_original: string;
        marca: string;
        modelo: string | null;
        nome_categoria: string;
        categoria_descricao: string;
        veiculo: string;
        imagens: string[];
    }
    type FormattedProduct = Omit<ProductProp, 'imagens'> & {
        imagens: { id: string, image: string }[];
    }
}
