// [COMMIT 3 - REQUISITO 3]
// Exceção para corpo vazio ou sem nome/email para atualização.
const ApiError = require("./ApiError");

class DadosAtualizacaoInvalidosError extends ApiError {
  constructor(
    message = "Informe nome e/ou email para atualizar",
    statusCode = 400,
  ) {
    super(message, statusCode);
  }
}

module.exports = DadosAtualizacaoInvalidosError;
