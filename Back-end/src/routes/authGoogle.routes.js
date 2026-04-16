const jwt = require("jsonwebtoken");
const { firebaseAdmin } = require("../firebaseAdmin");
const { allowedEmails } = require("../../AllowEmailsOlny");
const router = require('express-promise-router')();

router.post("/auth/google", async (req, res) => {
  try {
    const { tokenFirebase } = req.body;

    const decoded = await firebaseAdmin.auth().verifyIdToken(tokenFirebase);

    const email = decoded.email;

    // Permitir somente usuários autorizados
    if (!allowedEmails.includes(email)) {
      return res.status(401).json({ error: "Usuário não autorizado" });
    }

    // Gerar JWT próprio
    const token = jwt.sign(
      {
        uid: decoded.uid,
        email: decoded.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({ token });

  } catch (err) {
    return res.status(400).json({ error: "Token inválido" });
  }
});

module.exports = router;