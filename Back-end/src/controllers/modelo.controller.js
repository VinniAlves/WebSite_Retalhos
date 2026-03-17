const db = require("../config/database");

exports.createModel = async(req,res) =>{
    const {modelo} = req.body;
    await db.query(
        'INSERT INTO modelo (modelo, delete_logic) VALUES ($1, false)',[
            modelo
        ]
    )
    res.status(201).send({
        message: "Modelo adicionada com sucesso",
        body:{
            modelo: {
                modelo
            }
        },
    })
}

exports.listAllModel = async (req, res) => {
    const response = await db.query('SELECT * FROM modelo ORDER BY id ASC');
    res.status(200).send(response.rows);
};

exports.uptadeModel = async (req,res) =>{
    const {id} = req.params;
    const {modelo} = req.body;


        await db.query(
                'UPDATE modelo SET modelo = $1 WHERE id = $2',
                [modelo, id]
            )

    
    res.status(200).send({
        message: "Modelo atualizada com sucesso",
        body:{
            modelo: {
                modelo
            }
        },
    })
}

exports.deleteModel = async (req,res) =>{
    const {id} = req.params;
    await db.query(`UPDATE modelo SET delete_logic = true WHERE id = ${id}`)
    res.status(200).send({
        message: "Modelo deletada com sucesso"
    })
}

exports.activeModel = async (req,res) =>{
    const {id} = req.params;
    await db.query(`UPDATE modelo SET delete_logic = false WHERE id = ${id}`)
    res.status(200).send({
        message: "Modelo ativada com sucesso"
    })
}