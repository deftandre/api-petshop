class NotFound extends Error {
    constructor(entidade) {
        super(`${entidade} não foi encontrado`);
        this.name = "NotFound";
        this.idError = 0;
    }
}

module.exports = NotFound;
