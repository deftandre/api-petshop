const ValueNotSupported = require("./errors/ValueNotSupported");
const jsontoxml = require("jsontoxml");

class Serializador {
    json(dados) {
        return JSON.stringify(dados);
    }

    xml(dados) {
        let tag = this.tagSingular;

        if (Array.isArray(dados)) {
            tag = this.tagPlural;
            dados = dados.map((item) => {
                return {
                    [this.tagSingular]: item,
                };
            });
        }
        return jsontoxml({ [tag]: dados });
    }

    serializar(dados) {
        dados = this.filtrar(dados);
        if (this.contentType === "application/json") {
            return this.json(dados);
        }

        if (this.contentType === "application/xml") {
            return this.xml(dados);
        }

        throw new ValueNotSupported(this.contentType);
    }

    filtrarObjeto(dados) {
        const newObject = {};

        this.publicFields.forEach((field) => {
            if (dados.hasOwnProperty(field)) {
                newObject[field] = dados[field];
            }
        });

        return newObject;
    }

    filtrar(dados) {
        if (Array.isArray(dados)) {
            dados = dados.map((item) => this.filtrarObjeto(item));
        } else {
            dados = this.filtrarObjeto(dados);
        }

        return dados;
    }
}

class SerializadorFornecedor extends Serializador {
    constructor(contentType, extraFields) {
        super();
        this.contentType = contentType;
        this.publicFields = ["id", "empresa", "categoria"].concat(
            extraFields || []
        );
        this.tagSingular = "fornecedor";
        this.tagPlural = "fornecedores";
    }
}

class SerializadorError extends Serializador {
    constructor(contentType, extraFields) {
        super();
        this.contentType = contentType;
        this.publicFields = ["id", "mensagem"].concat(extraFields || []);
        this.tagSingular = "erro";
        this.tagPlural = "erros";
    }
}

module.exports = {
    Serializador: Serializador,
    SerializadorFornecedor: SerializadorFornecedor,
    SerializadorError: SerializadorError,
    formatosAceitos: ["application/json", "application/xml"],
};
