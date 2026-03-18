
const db = require("../config/database");
// ==> Método responsável por criar um novo 'Product':


exports.createProduct = async(req,res) =>{

    const { id_categoria, id_marca, id_modelo, descricao, ano, codigo,
        data_entrada, data_venda, anuncio_ml} = req.body;

    const {rows} = await db.query(
'INSERT INTO produtos ( id_categoria, id_marca, id_modelo, descricao, ano, codigo, data_entrada, data_venda, anuncio_ml, delete_logic) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, false)',[
    id_categoria,
    id_marca,
    id_modelo,
    descricao,
    ano,
    codigo,
    data_entrada,
    data_venda,
    anuncio_ml
]
    )
        

        res.status(201).send({
            message: "Produto adicionado com sucesso",
            body:{
                produtc: {
                    id_categoria,
                    id_marca,
                    id_modelo,
                    descricao,
                    ano,
                    codigo,
                    data_entrada,
                    data_venda,
                    anuncio_ml
                }
            },
        })
}


exports.listAllProducts = async (req, res) => {
    try {
        const { destaque, marca, categoria, veiculo, preco, modelo, page = 1 } = req.body;
        
        const limit = 30;
        const offset = (page - 1) * limit;

        let query = `
            SELECT 
                P.id, P.descricao, P.ano, P.codigo, P.anuncio_ml, P.valor_original, 
                M.marca, Md.modelo, C.nome_categoria, C.descricao as categoria_descricao, V.veiculo,
                COUNT(*) OVER() AS total_count
            FROM produtos P 
            INNER JOIN marca M ON P.id_marca = M.id 
            INNER JOIN modelo Md ON P.id_modelo = Md.id  
            INNER JOIN categoria C ON P.id_categoria = C.id  
            INNER JOIN veiculos V ON P.id_veiculo = V.id
        `;

        const queryValues = [];
        const filters = [];

        // Filtro básico: não mostrar itens deletados
        filters.push(`(P.delete_logic = false OR P.delete_logic IS NULL)`);

        if (destaque !== undefined && destaque !== null) {
            queryValues.push(destaque === true || destaque === 'true');
            filters.push(`P.destaque = $${queryValues.length}`);
        }
        if (marca) {
            const brands = Array.isArray(marca) ? marca : [marca];
            queryValues.push(brands);
            filters.push(`P.id_marca = ANY($${queryValues.length})`);
        }
        if (categoria) {
            const categories = Array.isArray(categoria) ? categoria : [categoria];
            queryValues.push(categories);
            filters.push(`P.id_categoria = ANY($${queryValues.length})`);
        }
        if (veiculo) {
            const vehicles = Array.isArray(veiculo) ? veiculo : [veiculo];
            queryValues.push(vehicles);
            filters.push(`P.id_veiculo = ANY($${queryValues.length})`);
        }
        if (modelo) {
            const models = Array.isArray(modelo) ? modelo : [modelo];
            queryValues.push(models);
            filters.push(`P.id_modelo = ANY($${queryValues.length})`);
        }
        if (preco) {
            queryValues.push(preco);
            filters.push(`P.valor_original <= $${queryValues.length}`);
        }

        if (filters.length > 0) {
            query += ` WHERE ${filters.join(' AND ')} `;
        }

        query += ` ORDER BY P.id ASC LIMIT $${queryValues.length + 1} OFFSET $${queryValues.length + 2}`;
        queryValues.push(limit, offset);

        const resProduct = await db.query(query, queryValues);

        const totalItems = resProduct.rows.length > 0 ? parseInt(resProduct.rows[0].total_count) : 0;
        const totalPages = Math.ceil(totalItems / limit);

        const productsWithImages = await Promise.all(resProduct.rows.map(async (item) => {
            const resImage = await db.query('SELECT caminho_image FROM image WHERE id_produto = $1', [item.id]);
            
            // Removemos o total_count de dentro do objeto do produto antes de enviar
            const { total_count, ...productData } = item;
            
            return {
                ...productData,
                imagens: resImage.rows.map(img => img.caminho_image)
            };
        }));

        res.status(200).send({
            products: productsWithImages,
            pagination: {
                totalItems,
                totalPages,
                currentPage: parseInt(page),
                itemsPerPage: limit
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Erro ao listar produtos",
            error: error.message
        });
    }
};

exports.deleteProducts = async (req,res) =>{
    const {id} = req.params;
    await db.query(`UPDATE produtos SET delete_logic = true WHERE id = ${id}`)
    res.status(200).send({
        message: "Produto deletada com sucesso"
    })
}

exports.activeProducts = async (req,res) =>{
    const {id} = req.params;
    await db.query(`UPDATE produtos SET delete_logic = false WHERE id = ${id}`)
    res.status(200).send({
        message: "Produto ativada com sucesso"
    })
}