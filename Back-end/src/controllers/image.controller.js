const db = require("../config/database");
const fs = require("fs");

exports.createImage = async (req, res, next) => {
  try {
    const produtoId = req.params.id;
    const folder = req.folderName;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "Nenhuma imagem enviada." });
    }
   
    const valoresInsert = files.map((f) => [
      produtoId,
      `/retalhos.cascavel/imagens/${folder}/${f.filename}`
    ]);

   
    for (const val of valoresInsert) {
      await db.query(
        `INSERT INTO image (id_produto, caminho_image, delete_logic) VALUES ($1, $2, false)`,
        val
      );
    }

    return res.status(200).json({
      message: "Imagens salvas com sucesso.",
      paths: valoresInsert.map((v) => v[1]),
    });
  } catch (error) {
    if (req.files) {
      req.files.forEach((f) => {
        if (f.path && fs.existsSync(f.path)) {
          try {
            fs.unlinkSync(f.path);
          } catch (unlinkErr) {
            console.error("Erro ao remover imagem após falha:", unlinkErr);
          }
        }
      });
    }

    next(error);
  }
};

exports.viewImage = async(req,res, next)=>{
    try {
        const {id} = req.params;
        const response = await db.query('SELECT * FROM image WHERE id_produto = $1', [id]);
        res.status(200).send(response.rows);
    } catch (error) {
        next(error);
    }
}

exports.deleteImage = async (req,res, next) =>{
    try {
        const {id} = req.params;
        await db.query(`UPDATE image SET delete_logic = true WHERE id = ${id}`)
        res.status(200).send({
            message: "Imagem deletada com sucesso"
        })
    } catch (error) {
        next(error);
    }
}

exports.activeImage = async (req,res, next) =>{
    try {
        const {id} = req.params;
        await db.query(`UPDATE image SET delete_logic = false WHERE id = ${id}`)
        res.status(200).send({
            message: "Imagem ativada com sucesso"
        })
    } catch (error) {
        next(error);
    }
}
