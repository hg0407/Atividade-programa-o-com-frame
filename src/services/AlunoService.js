const prisma = require("../databases/prisma");
const AlunoInvalidoError = require("../errors/AlunoInvalidoError");

// [COMMIT 1 - REQUISITO 1] Erro para page/pageSize/orderBy/order inválidos.
const PaginacaoInvalidaError = require("../errors/PaginacaoInvalidaError");

const CAMPOS_ORDENAVEIS = [
  "id",
  "nome",
  "email",
  "createdAt",
  "updatedAt",
];

const ORDENS_PERMITIDAS = ["asc", "desc"];

class AlunoService {
  // [COMMIT 1 - REQUISITO 1]
  // Adicionados orderBy, order e total ao findMany.
  async findMany(
    page = 1,
    pageSize = 10,
    orderBy = "id",
    order = "asc",
  ) {
    const pagina = Number(page);
    const tamanhoPagina = Number(pageSize);
    const campoOrdenacao = orderBy || "id";
    const direcao = order || "asc";

    // [COMMIT 1 - REQUISITO 1]
    // Whitelist para impedir campos/direções inválidos.
    if (
      !Number.isInteger(pagina) ||
      pagina < 1 ||
      !Number.isInteger(tamanhoPagina) ||
      tamanhoPagina < 1 ||
      !CAMPOS_ORDENAVEIS.includes(campoOrdenacao) ||
      !ORDENS_PERMITIDAS.includes(direcao)
    ) {
      throw new PaginacaoInvalidaError();
    }

    // [COMMIT 1 - REQUISITO 1]
    // count() representa todos os alunos, não apenas os da página atual.
    const [alunos, total] = await Promise.all([
      prisma.aluno.findMany({
        skip: (pagina - 1) * tamanhoPagina,
        take: tamanhoPagina,
        orderBy: {
          [campoOrdenacao]: direcao,
        },
      }),
      prisma.aluno.count(),
    ]);

    return {
      alunos,
      total,
    };
  }

  async create(aluno) {
    const { nome, email } = aluno;

    if (!nome || !email) {
      throw new AlunoInvalidoError();
    }

    // create = insert
    // update = update
    // delete = delete
    // findMany = select *
    const novoAluno = await prisma.aluno.create({
      data: aluno,
    });

    return novoAluno;
  }
}

module.exports = new AlunoService();