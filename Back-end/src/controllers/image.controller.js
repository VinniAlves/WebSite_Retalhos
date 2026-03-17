const db = require("../config/database");
const fs = require("fs");

exports.createImage = async (req, res) => {
  try {
    const produtoId = req.params.id;
    const folder = req.folderName;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "Nenhuma imagem enviada." });
    }
   
    const valoresInsert = files.map((f) => [
      produtoId,
      `/imagens/${folder}/${f.filename}`
    ]);

   
    for (const val of valoresInsert) {
      await db.query(
        `INSERT INTO image (id_produto, caminho_image) VALUES ($1, $2)`,
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

    console.error("Erro ao salvar imagens:", error);
    return res.status(500).json({ error: "Erro ao salvar imagens." });
  }
};

exports.viewImage = async(req,res)=>{
    const {id} = req.params;
    const response = await db.query('SELECT * FROM image WHERE id_produto = $1', [id]);
    res.status(200).send(response.rows);
}



