class NotFound extends Error {
    constructor() {
        super("Fornecedor não foi encontrado");
        this.name = "NotFound";
        this.idError = 0;
    }
}

module.exports = NotFound;
