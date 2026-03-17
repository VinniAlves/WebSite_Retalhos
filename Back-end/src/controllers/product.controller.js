
const db = require("../config/database");
// ==> Método responsável por criar um novo 'Product':


exports.createProduct = async(req,res) =>{

    const { id_categoria, id_marca, id_modelo, descricao, ano, codigo,
        data_entrada, data_venda, anuncio_ml, id_image} = req.body;

    const {rows} = await db.query(
'INSERT INTO produtos ( id_categoria, id_marca, id_modelo, descricao, ano, codigo, data_entrada, data_venda, anuncio_ml, id_image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',[
    id_categoria,
    id_marca,
    id_modelo,
    descricao,
    ano,
    codigo,
    data_entrada,
    data_venda,
    anuncio_ml,
    id_image
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
                    anuncio_ml,
                    id_image
                }
            },
        })
}

exports.listAllProducts = async (req, res) => {
  const response = await db.query('SELECT * FROM produtos ORDER BY id ASC');
  res.status(200).send(response.rows);
};

exports.listProductsDestaque = async (req, res) => {
    const response = await db.query('SELECT * FROM produtos WHERE destaque = true ORDER BY id ASC');
    res.status(200).send(response.rows);
};