const db = require("../config/database");

exports.createCategory = async(req,res) =>{
    const {nome_categoria, descricao} = req.body;
    const {rows} = await db.query(
        'INSERT INTO categoria (nome_categoria, descricao, delete_logic) VALUES ($1, $2, false)',[
            nome_categoria,
            descricao
        ]
    )
    res.status(201).send({
        message: "Categoria adicionada com sucesso",
        body:{
            categoria: {
                nome_categoria,
                descricao
            }
        },
    })
}

exports.listAllCategories = async (req, res) => {
    const response = await db.query('SELECT * FROM categoria ORDER BY id ASC');
    res.status(200).send(response.rows);
};

exports.uptadeCategories = async (req,res) =>{
    const {id} = req.params;
    const {nome_categoria, descricao} = req.body;


const response = await db.query(
                'UPDATE categoria SET nome_categoria = COALESCE($1, nome_categoria), descricao = COALESCE($2, descricao) WHERE id = $3',
                [nome_categoria, descricao, id]
            )
    
    res.status(200).send({
        message: "Categoria atualizada com sucesso",
        body:{
            categoria: {
                nome_categoria,
                descricao
            }
        },
    })
}

exports.deleteCategories = async (req,res) =>{
    const {id} = req.params;
    await db.query(`UPDATE categoria SET delete_logic = true WHERE id = ${id}`)
    res.status(200).send({
        message: "Categoria deletada com sucesso"
    })
}

exports.activeCategories = async (req,res) =>{
    const {id} = req.params;
    await db.query(`UPDATE categoria SET delete_logic = false WHERE id = ${id}`)
    res.status(200).send({
        message: "Categoria ativada com sucesso"
    })
}