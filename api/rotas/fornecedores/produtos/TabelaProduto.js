const Modelo = require("./ModeloTabelaProduto");
const instancia = require("../../../db");
const NotFound = require("../../../errors/NotFound");

module.exports = {
    listar(idFornecedor) {
        return Modelo.findAll({
            where: {
                fornecedor: idFornecedor,
            },
            raw: true,
        });
    },

    inserir(produto) {
        return Modelo.create(produto);
    },

    remover(idProduto, idFornecedor) {
        return Modelo.destroy({
            where: {
                id: idProduto,
                fornecedor: idFornecedor,
            },
        });
    },

    async pegarPorId(idProduto, idFornecedor) {
        const encontrado = await Modelo.findOne({
            where: {
                id: idProduto,
                fornecedor: idFornecedor,
            },
            raw: true,
        });

        if (!encontrado) {
            throw new NotFound("Produto");
        }

        return encontrado;
    },

    atualizar(dadosDoProduto, dadosParaAtualizar) {
        return Modelo.update(dadosParaAtualizar, { where: dadosDoProduto });
    },

    subtrair(idProduto, idFornecedor, field, quantidade) {
        return instancia.transaction(async (transacao) => {
            const produto = await Modelo.findOne({
                where: {
                    id: idProduto,
                    fornecedor: idFornecedor,
                },
            });

            produto[field] = quantidade;

            await produto.save();

            return produto;
        });
    },
};
