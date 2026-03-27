
const db = require("../config/database");


exports.createProduct = async (req, res) => {
    const {
        id_categoria,
        id_marca,
        id_modelo,
        descricao,
        ano,
        codigo,
        data_entrada,
        anuncio_ml,
        id_veiculo,
        valor_original,
        valor_ml,
        destaque,
        titulo,
    } = req.body;

    const { rows } = await db.query(
        `INSERT INTO produtos (
            id_categoria, id_marca, id_modelo, descricao, ano, codigo,
            data_entrada, anuncio_ml, id_veiculo, valor_original, valor_ml,
            destaque, titulo, delete_logic
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, false)
        RETURNING id`,
        [
            id_categoria,
            id_marca,
            id_modelo,
            descricao,
            ano,
            codigo,
            data_entrada,
            anuncio_ml,
            id_veiculo,
            valor_original,
            valor_ml,
            destaque,
            titulo,
        ]
    );

    const id = rows[0].id;

    res.status(201).send({
        message: "Produto adicionado com sucesso",
        id,
        body: {
            product: {
                id,
                titulo,
                id_categoria,
                id_marca,
                id_modelo,
                descricao,
                ano,
                codigo,
                data_entrada,
                anuncio_ml,
                id_veiculo,
                valor_original,
                valor_ml,
                destaque,
            },
        },
    });
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT
                P.id, P.descricao, P.ano, P.codigo, P.anuncio_ml, P.valor_original, P.titulo,
                P.id_categoria, P.id_marca, P.id_modelo, P.id_veiculo,
                P.data_entrada, P.destaque, P.valor_ml, P.valor_venda,
                P.delete_logic,
                M.marca, Md.modelo, C.nome_categoria, C.descricao AS categoria_descricao, V.veiculo
            FROM produtos P
            INNER JOIN marca M ON P.id_marca = M.id
            INNER JOIN modelo Md ON P.id_modelo = Md.id
            INNER JOIN categoria C ON P.id_categoria = C.id
            INNER JOIN veiculos V ON P.id_veiculo = V.id
            WHERE P.id = $1
        `;
        const { rows } = await db.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Produto não encontrado" });
        }
        const row = rows[0];
        const resImage = await db.query(
            "SELECT caminho_image FROM image WHERE id_produto = $1 AND (delete_logic = false OR delete_logic IS NULL)",
            [id]
        );
        const { ...productData } = row;
        res.status(200).json({
            product: {
                ...productData,
                imagens: resImage.rows.map((img) => img.caminho_image),
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erro ao buscar produto",
            error: error.message,
        });
    }
};


exports.listAllProducts = async (req, res) => {
    try {
        const {
            destaque,
            marca,
            categoria,
            veiculo,
            modelo,
            minPrice,
            maxPrice,
            page = 1,
            includeDeleted,
        } = req.body;

        const limit = 30;
        const offset = (page - 1) * limit;

        let query = `
            SELECT 
            P.id, P.descricao, P.ano, P.codigo, P.anuncio_ml, P.valor_original, P.titulo,
            P.delete_logic, P.destaque,
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

        if (!includeDeleted) {
            filters.push(`(P.delete_logic = false OR P.delete_logic IS NULL)`);
        }

        // ---------------------------------------------
        // Função auxiliar para filtros de arrays
        // ---------------------------------------------
        const applyArrayFilter = (fieldName, values) => {
            if (values === undefined || values === null) return;

            let arr = Array.isArray(values) ? values : [values];

            // converter para número
            arr = arr.map(v => Number(v)).filter(v => !isNaN(v));

            if (arr.length === 0) return;

            queryValues.push(arr);
            filters.push(`${fieldName} = ANY($${queryValues.length}::int[])`);
        };

        // Filtros
        // ---------------------------------------------
        // Destaque (boolean)
        if (destaque !== undefined && destaque !== null) {
            queryValues.push(destaque === true || destaque === "true");
            filters.push(`P.destaque = $${queryValues.length}`);
        }

        // Marca
        applyArrayFilter("P.id_marca", marca);

        // Categoria
        applyArrayFilter("P.id_categoria", categoria);

        // Veículo
        applyArrayFilter("P.id_veiculo", veiculo);

        // Modelo
        applyArrayFilter("P.id_modelo", modelo);

        // Preço mínimo
        if (minPrice !== undefined && minPrice !== null) {
            queryValues.push(Number(minPrice));
            filters.push(`P.valor_original >= $${queryValues.length}`);
        }

        // Preço máximo
        if (maxPrice !== undefined && maxPrice !== null) {
            queryValues.push(Number(maxPrice));
            filters.push(`P.valor_original <= $${queryValues.length}`);
        }

        // ---------------------------------------------
        // Aplicar filtros
        // ---------------------------------------------
        if (filters.length > 0) {
            query += ` WHERE ${filters.join(" AND ")} `;
        }

        query += ` ORDER BY P.id ASC LIMIT $${queryValues.length + 1} OFFSET $${queryValues.length + 2}`;
        queryValues.push(limit, offset);

        // ---------------------------------------------
        // Execução da query
        // ---------------------------------------------
        const resProduct = await db.query(query, queryValues);

        const totalItems =
            resProduct.rows.length > 0
                ? parseInt(resProduct.rows[0].total_count)
                : 0;

        const totalPages = Math.ceil(totalItems / limit);

        // ---------------------------------------------
        // Buscar imagens
        // ---------------------------------------------
        const productsWithImages = await Promise.all(
            resProduct.rows.map(async (item) => {
                const resImage = await db.query(
                    "SELECT caminho_image FROM image WHERE id_produto = $1",
                    [item.id]
                );

                const { total_count, ...productData } = item;

                return {
                    ...productData,
                    imagens: resImage.rows.map((img) => img.caminho_image),
                };
            })
        );

        // ---------------------------------------------
        // Resposta final
        // ---------------------------------------------
        res.status(200).json({
            products: productsWithImages,
            pagination: {
                totalItems,
                totalPages,
                currentPage: parseInt(page),
                itemsPerPage: limit,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erro ao listar produtos",
            error: error.message,
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

exports.searchProducts = async (req, res) => {
    try {
        const { search, page = 1, includeDeleted } = req.body;
        
        const limit = 30;
        const offset = (page - 1) * limit;
        const searchTerm = `%${search || ''}%`;

        let query = `
            SELECT 
                P.id, P.descricao, P.ano, P.codigo, P.anuncio_ml, P.valor_original, P.titulo,
                P.delete_logic, P.destaque,
                M.marca, Md.modelo, C.nome_categoria, C.descricao as categoria_descricao, V.veiculo,
                COUNT(*) OVER() AS total_count
            FROM produtos P 
            INNER JOIN marca M ON P.id_marca = M.id 
            INNER JOIN modelo Md ON P.id_modelo = Md.id  
            INNER JOIN categoria C ON P.id_categoria = C.id  
            INNER JOIN veiculos V ON P.id_veiculo = V.id
            WHERE 1=1
        `;

        if (!includeDeleted) {
            query += ` AND (P.delete_logic = false OR P.delete_logic IS NULL) `;
        }

        const queryValues = [searchTerm];

        if (search) {
            query += `
                AND (
                    P.descricao ILIKE $1 OR 
                    P.titulo ILIKE $1 OR
                    P.codigo ILIKE $1 OR
                    M.marca ILIKE $1 OR 
                    Md.modelo ILIKE $1 OR 
                    C.nome_categoria ILIKE $1 OR 
                    V.veiculo ILIKE $1
                )
            `;
        }

        query += ` ORDER BY P.id ASC LIMIT $${queryValues.length + 1} OFFSET $${queryValues.length + 2}`;
        queryValues.push(limit, offset);

        const resProduct = await db.query(query, queryValues);

        const totalItems = resProduct.rows.length > 0 ? parseInt(resProduct.rows[0].total_count) : 0;
        const totalPages = Math.ceil(totalItems / limit);

        const productsWithImages = await Promise.all(resProduct.rows.map(async (item) => {
            const resImage = await db.query('SELECT caminho_image FROM image WHERE id_produto = $1', [item.id]);
            
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
            message: "Erro ao buscar produtos",
            error: error.message
        });
    }
};


exports.relatedProducts = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT 
                P.id, P.descricao, P.ano, P.codigo, P.anuncio_ml, P.valor_original, P.titulo,
                M.marca, Md.modelo, C.nome_categoria, C.descricao as categoria_descricao, V.veiculo
            FROM produtos P 
            INNER JOIN marca M ON P.id_marca = M.id 
            INNER JOIN modelo Md ON P.id_modelo = Md.id  
            INNER JOIN categoria C ON P.id_categoria = C.id  
            INNER JOIN veiculos V ON P.id_veiculo = V.id
            WHERE P.id_categoria = $1
            AND (P.delete_logic = false)
            ORDER BY RANDOM() 
            LIMIT 8
        `;
        
        const { rows } = await db.query(query, [id]);

        const productsWithImages = await Promise.all(rows.map(async (item) => {
            const resImage = await db.query('SELECT caminho_image FROM image WHERE id_produto = $1', [item.id]);
            return {
                ...item,
                imagens: resImage.rows.map(img => img.caminho_image)
            };
        }));

        res.status(200).send(productsWithImages);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Erro ao buscar produtos relacionados",
            error: error.message
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            id_categoria, id_marca, id_modelo, descricao, ano, codigo,
            data_entrada, anuncio_ml, id_veiculo, valor_original, valor_ml, 
            destaque, titulo, valor_venda 
        } = req.body;

        const fields = [];
        const values = [];
        let queryIndex = 1;

        const updateField = (fieldName, value) => {
            if (value !== undefined) {
                fields.push(`${fieldName} = $${queryIndex}`);
                values.push(value);
                queryIndex++;
            }
        };

        updateField('id_categoria', id_categoria);
        updateField('id_marca', id_marca);
        updateField('id_modelo', id_modelo);
        updateField('descricao', descricao);
        updateField('ano', ano);
        updateField('codigo', codigo);
        updateField('data_entrada', data_entrada);
        updateField('anuncio_ml', anuncio_ml);
        updateField('id_veiculo', id_veiculo);
        updateField('valor_original', valor_original);
        updateField('valor_ml', valor_ml);
        updateField('destaque', destaque);
        updateField('titulo', titulo);
        updateField('valor_venda', valor_venda);

        if (fields.length === 0) {
            return res.status(400).send({ message: "Nenhum campo para atualizar fornecido" });
        }

        values.push(id);
        const query = `UPDATE produtos SET ${fields.join(', ')} WHERE id = $${queryIndex}`;

        await db.query(query, values);

        res.status(200).send({
            message: "Produto atualizado com sucesso",
            body: {
                product: { id, ...req.body }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Erro ao atualizar produto",
            error: error.message
        });
    }
};
