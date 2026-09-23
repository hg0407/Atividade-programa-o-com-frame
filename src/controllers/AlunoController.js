const alunoService = require("../services/AlunoService");

class AlunoController {
  // [COMMIT 1 - REQUISITO 1]
  // Lê orderBy/order e devolve alunos + total.
  async findMany(request, response) {
    try {
      const {
        page = 1,
        pageSize = 10,
        orderBy = "id",
        order,
        tipoOrdenacao,
      } = request.query;

      const resultado = await alunoService.findMany(
        page,
        pageSize,
        orderBy,
        order ?? tipoOrdenacao ?? "asc",
      );

      return response.status(200).json(resultado);
    } catch (error) {
      return response.status(error.statusCode || 500).json({
        error: error.message,
      });
    }
  }

  async create(request, response) {
    try {
      const aluno = await alunoService.create(request.body);

      return response.status(201).json({
        aluno,
      });
    } catch (error) {
      return response.status(error.statusCode || 500).json({
        error: error.message,
      });
    }
  }

  // [COMMIT 2 - REQUISITO 2]
  // Retorna um aluno pelo ID informado na URL.
  async findById(request, response) {
    try {
      const aluno = await alunoService.findById(request.params.id);

      return response.status(200).json({
        aluno,
      });
    } catch (error) {
      return response.status(error.statusCode || 500).json({
        error: error.message,
      });
    }
  }

  // [COMMIT 3 - REQUISITO 3]
  // Atualiza parcialmente um aluno e devolve o registro atualizado.
  async update(request, response) {
    try {
      const aluno = await alunoService.update(
        request.params.id,
        request.body,
      );

      return response.status(200).json({
        aluno,
      });
    } catch (error) {
      return response.status(error.statusCode || 500).json({
        error: error.message,
      });
    }
  }

  // [COMMIT 4 - REQUISITO 4]
  // Remove um aluno e retorna 204 sem corpo.
  async delete(request, response) {
    try {
      await alunoService.delete(request.params.id);
      return response.status(204).end();
    } catch (error) {
      return response.status(error.statusCode || 500).json({
        error: error.message,
      });
    }
  }
}

module.exports = new AlunoController();