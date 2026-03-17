const db = require("../config/database");

exports.createVehicle= async(req,res) =>{
    const {veiculo} = req.body;
    await db.query(
        'INSERT INTO veiculos (veiculo, delete_logic) VALUES ($1, false)',[
            veiculo
        ]
    )
    res.status(201).send({
        message: "Veiculo adicionada com sucesso",
        body:{
            veiculo: {
                veiculo
            }
        },
    })
}

exports.listAllVehicle = async (req, res) => {
    const response = await db.query('SELECT * FROM veiculos ORDER BY id ASC');
    res.status(200).send(response.rows);
};

exports.uptadeVehicle = async (req,res) =>{
    const {id} = req.params;
    const {veiculo} = req.body;


        await db.query(
                'UPDATE veiculos SET veiculo = $1 WHERE id = $2',
                [veiculo, id]
            )

    
    res.status(200).send({
        message: "Veiculo atualizada com sucesso",
        body:{
            veiculo: {
                veiculo
            }
        },
    })
}

exports.deleteVehicle = async (req,res) =>{
    const {id} = req.params;
    await db.query(`UPDATE veiculos SET delete_logic = true WHERE id = ${id}`)
    res.status(200).send({
        message: "Veiculo deletada com sucesso"
    })
}

exports.activeVehicle = async (req,res) =>{
    const {id} = req.params;
    await db.query(`UPDATE veiculos SET delete_logic = false WHERE id = ${id}`)
    res.status(200).send({
        message: "Veiculo ativada com sucesso"
    })
}