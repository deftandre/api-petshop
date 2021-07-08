const modelos = [
    require("../rotas/fornecedores/ModeloTabelaForncedor"),
    require("../rotas/fornecedores/produtos/ModeloTabelaProduto"),
];

function criarTabelas() {
    modelos.map(async (modelo) => await modelo.sync());
}

criarTabelas();
