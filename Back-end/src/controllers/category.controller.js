const db = require("../config/database");

exports.createCategory = async(req,res, next) =>{
    try {
        const {nome_categoria, descricao} = req.body;
        await db.query(
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
    } catch (error) {
        next(error);
    }
}

exports.listAllCategories = async (req, res, next) => {
    try {
        const response = await db.query('SELECT * FROM categoria ORDER BY id ASC');
        res.status(200).send(response.rows);
    } catch (error) {
        next(error);
    }
};

exports.uptadeCategories = async (req,res, next) =>{
    try {
        const {id} = req.params;
        const {nome_categoria, descricao} = req.body;

        await db.query(
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
    } catch (error) {
        next(error);
    }
}

exports.deleteCategories = async (req,res, next) =>{
    try {
        const {id} = req.params;
        await db.query(`UPDATE categoria SET delete_logic = true WHERE id = ${id}`)
        res.status(200).send({
            message: "Categoria deletada com sucesso"
        })
    } catch (error) {
        next(error);
    }
}

exports.activeCategories = async (req,res, next) =>{
    try {
        const {id} = req.params;
        await db.query(`UPDATE categoria SET delete_logic = false WHERE id = ${id}`)
        res.status(200).send({
            message: "Categoria ativada com sucesso"
        })
    } catch (error) {
        next(error);
    }
}