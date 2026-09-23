// [COMMIT 1 - REQUISITO 1] Exceção para parâmetros inválidos de paginação/ordenação.
const ApiError = require("./ApiError");

class PaginacaoInvalidaError extends ApiError {
  constructor(
    message = "Parâmetros de paginação ou ordenação inválidos",
    statusCode = 400,
  ) {
    super(message, statusCode);
  }
}

module.exports = PaginacaoInvalidaError;
