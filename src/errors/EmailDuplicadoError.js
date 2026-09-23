// [COMMIT 3 - REQUISITO 3]
// Exceção para conflito com o email único de outro aluno.
const ApiError = require("./ApiError");

class EmailDuplicadoError extends ApiError {
  constructor(
    message = "Email já cadastrado",
    statusCode = 409,
  ) {
    super(message, statusCode);
  }
}

module.exports = EmailDuplicadoError;
