const TabelaFornecedor = require("./TabelaFornecedor");
const InvalidField = require("../../errors/InvalidField");
const DataNotFound = require("../../errors/DataNotFound");

class Fornecedor {
    constructor({
        id,
        empresa,
        email,
        categoria,
        dataCriacao,
        dataAtualizacao,
        versao,
    }) {
        this.id = id;
        this.empresa = empresa;
        this.email = email;
        this.categoria = categoria;
        this.dataCriacao = dataCriacao;
        this.dataAtualizacao = dataAtualizacao;
        this.versao = versao;
    }

    async criar() {
        this.validar();
        const result = await TabelaFornecedor.inserir({
            empresa: this.empresa,
            email: this.email,
            categoria: this.categoria,
        });

        this.id = result.id;
        this.dataCriacao = result.dataCriacao;
        this.dataAtualizacao = result.dataAtualizacao;
        this.versao = result.versao;
    }

    async carregar() {
        const encontrado = await TabelaFornecedor.pegarPorId(this.id);

        this.empresa = encontrado.empresa;
        this.email = encontrado.email;
        this.categoria = encontrado.categoria;
        this.dataCriacao = encontrado.dataCriacao;
        this.dataAtualizacao = encontrado.dataAtualizacao;
        this.versao = encontrado.versao;
    }

    async atualizar() {
        await TabelaFornecedor.pegarPorId(this.id);
        const fields = ["empresa", "email", "categoria"];
        const dadosParaAtualizar = {};

        fields.forEach((field) => {
            const value = this[field];

            if (typeof value === "string" && value.length > 0) {
                dadosParaAtualizar[field] = value;
            }
        });

        if (Object.keys(dadosParaAtualizar).length === 0) {
            throw new DataNotFound();
        }

        await TabelaFornecedor.atualizar(this.id, dadosParaAtualizar);
    }

    remover() {
        return TabelaFornecedor.remover(this.id);
    }

    validar() {
        const fields = ["empresa", "email", "categoria"];

        fields.forEach((field) => {
            const value = this[field];

            if (typeof value !== "string" || value.length === 0) {
                throw new InvalidField(field);
            }
        });
    }
}

module.exports = Fornecedor;
