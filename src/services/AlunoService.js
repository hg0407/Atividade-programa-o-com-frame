const prisma = require("../databases/prisma");
const AlunoInvalidoError = require("../errors/AlunoInvalidoError");

// [COMMIT 1 - REQUISITO 1] Erro para page/pageSize/orderBy/order inválidos.
const PaginacaoInvalidaError = require("../errors/PaginacaoInvalidaError");

// [COMMIT 2 - REQUISITO 2]
// Importa a exceção específica para aluno inexistente.
const AlunoNaoEncontradoError = require("../errors/AlunoNaoEncontradoError");

// [COMMIT 3 - REQUISITO 3]
// Exceções específicas do processo de atualização.
const DadosAtualizacaoInvalidosError = require("../errors/DadosAtualizacaoInvalidosError");
const EmailDuplicadoError = require("../errors/EmailDuplicadoError");

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

  // [COMMIT 2 - REQUISITO 2]
  // Busca um aluno pelo ID usando findUnique.
  async findById(id) {
    const aluno = await prisma.aluno.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!aluno) {
      throw new AlunoNaoEncontradoError();
    }

    return aluno;
  }

  // [COMMIT 3 - REQUISITO 3]
  // Atualiza somente nome e/ou email enviados pelo cliente.
  async update(id, dados) {
    const dadosAtualizacao = dados ?? {};
    const data = {};

    if (dadosAtualizacao.nome !== undefined) {
      if (
        typeof dadosAtualizacao.nome !== "string" ||
        !dadosAtualizacao.nome.trim()
      ) {
        throw new AlunoInvalidoError("Nome não pode ser vazio");
      }

      data.nome = dadosAtualizacao.nome.trim();
    }

    if (dadosAtualizacao.email !== undefined) {
      if (
        typeof dadosAtualizacao.email !== "string" ||
        !dadosAtualizacao.email.trim()
      ) {
        throw new AlunoInvalidoError("Email não pode ser vazio");
      }

      data.email = dadosAtualizacao.email.trim();
    }

    // [COMMIT 3 - REQUISITO 3]
    // Impede update sem campos válidos.
    if (Object.keys(data).length === 0) {
      throw new DadosAtualizacaoInvalidosError();
    }

    // [COMMIT 3 - REQUISITO 3]
    // Reaproveita o findById do Commit 2 para tratar aluno inexistente.
    await this.findById(id);

    try {
      return await prisma.aluno.update({
        where: {
          id: Number(id),
        },
        data,
      });
    } catch (error) {
      // [COMMIT 3 - REQUISITO 3]
      // P2002 indica violação do @unique do campo email.
      if (error.code === "P2002") {
        throw new EmailDuplicadoError();
      }

      throw error;
    }
  }
}

module.exports = new AlunoService();