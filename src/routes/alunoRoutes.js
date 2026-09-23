const express = require("express");
const alunoController = require("../controllers/AlunoController");
const validarAluno = require("../middlewares/validarAluno");

const router = express.Router();

router.get("/", (request, response, next) => {
  console.log("Executando antes do findMany");
  next();
}, alunoController.findMany);
router.post("/", validarAluno, alunoController.create);

// [COMMIT 2 - REQUISITO 2]
// Busca um aluno pelo ID.
router.get("/:id", alunoController.findById);

// [COMMIT 3 - REQUISITO 3]
// Atualiza nome e/ou email do aluno.
router.patch("/:id", alunoController.update);

// [COMMIT 4 - REQUISITO 4]
// Remove um aluno pelo ID.
router.delete("/:id", alunoController.delete);

module.exports = router;