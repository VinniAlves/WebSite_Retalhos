const db = require("../config/database");

exports.createMark = async(req,res, next) =>{
    try {
        const {marca} = req.body;
        await db.query(
            'INSERT INTO marca (marca,delete_logic ) VALUES ($1, false)',[
                marca
            ]
        )
        res.status(201).send({
            message: "Marca adicionada com sucesso",
            body:{
                marca: {
                    marca
                }
            },
        })
    } catch (error) {
        next(error);
    }
}

exports.listAllMark = async (req, res, next) => {
    try {
        const response = await db.query('SELECT * FROM marca ORDER BY id ASC');
        res.status(200).send(response.rows);
    } catch (error) {
        next(error);
    }
};

exports.uptadeMark = async (req,res, next) =>{
    try {
        const {id} = req.params;
        const {marca} = req.body;

        await db.query(
                'UPDATE marca SET marca = $1 WHERE id = $2',
                [marca, id]
            )

        res.status(200).send({
            message: "Marca atualizada com sucesso",
            body:{
                Marca: {
                    marca
                }
            },
        })
    } catch (error) {
        next(error);
    }
}

exports.deleteMark = async (req,res, next) =>{
    try {
        const {id} = req.params;
        await db.query(`UPDATE marca SET delete_logic = true WHERE id = ${id}`)
        res.status(200).send({
            message: "Marca deletada com sucesso"
        })
    } catch (error) {
        next(error);
    }
}

exports.activeMark = async (req,res, next) =>{
    try {
        const {id} = req.params;
        await db.query(`UPDATE marca SET delete_logic = false WHERE id = ${id}`)
        res.status(200).send({
            message: "Marca ativada com sucesso"
        })
    } catch (error) {
        next(error);
    }
}