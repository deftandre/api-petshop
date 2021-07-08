const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const config = require("config");
const NotFound = require("./errors/NotFound");
const InvalidField = require("./errors/InvalidField");
const DataNotFound = require("./errors/DataNotFound");
const ValueNotSupported = require("./errors/ValueNotSupported");
const formatosAceitos = require("./Serializador").formatosAceitos;
const SerializadorError = require("./Serializador").SerializadorError;

app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());

app.use((req, res, next) => {
    let formatoRequisitado = req.header("Accept");

    if (formatoRequisitado === "*/*") {
        formatoRequisitado = "application/json";
    }

    if (formatosAceitos.indexOf(formatoRequisitado) === -1) {
        res.status(406).end();
        return;
    }

    res.setHeader("Content-Type", formatoRequisitado);
    next();
});

app.use((req, res, next) => {
    res.set("Access-Control-Allow-Origin", "*");
    next();
});

const roteador = require("./rotas/fornecedores");
app.use("/api/fornecedores", roteador);

const roteadorV2 = require("./rotas/fornecedores/rotas.v2");
app.use("/api/v2/fornecedores", roteadorV2);

app.use((err, req, res, next) => {
    let status = 500;

    if (err instanceof NotFound) {
        status = 404;
    }

    if (err instanceof InvalidField || err instanceof DataNotFound) {
        status = 400;
    }

    if (err instanceof ValueNotSupported) {
        status = 406;
    }

    const serializador = new SerializadorError(res.getHeader("Content-Type"));
    res.status(status).send(
        serializador.serializar({
            mensagem: err.message,
            id: err.idError,
        })
    );
});

app.listen(config.get("api.port"), () =>
    console.log("a API está funcionando!")
);
