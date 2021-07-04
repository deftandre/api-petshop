const ModeloTabela = require("../rotas/fornecedores/ModeloTabelaForncedor");

ModeloTabela.sync()
    .then(() => console.log("Tabela criada com sucesso"))
    .catch(console.log());
