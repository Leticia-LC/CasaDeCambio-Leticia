var botao = document.getElementById("idButton");
botao.addEventListener("click", buscarCotacaoEntrada);

// Definindo os pares de seleções de moedas e valores de conversão
var paresMoedas = [
    { listaMoedasId: "idMoedas", valorId: "idValor", conversaoId: "idOut" },
    { listaMoedasId: "idMoedas2", valorId: "idValor2", conversaoId: "idOut2" }
];

var dataAt = dataAtual();
var conversao;

// Iterando sobre cada par de seleções de moedas e valores
paresMoedas.forEach(function (par) {
    buscarMoedasAJAX(function (moedas) {
        carregarSelectMoedas(moedas, par.listaMoedasId);
    });
});

function buscarMoedasAJAX(carregarSelectMoedas) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/Moedas?$top=100&$format=json&$select=simbolo,nomeFormatado,tipoMoeda");

    xhr.addEventListener("load", function () {
        let resposta = xhr.responseText;
        let moedas = JSON.parse(resposta);
        carregarSelectMoedas(moedas);
    });

    xhr.send();
}

function carregarSelectMoedas(moedas, listaMoedasId) {
    let listaMoedas = document.getElementById(listaMoedasId);
    for (let i = 0; i < moedas.value.length; i++) {
        let optionMoeda = document.createElement("option");
        optionMoeda.value = moedas.value[i].simbolo;
        optionMoeda.innerText = moedas.value[i].nomeFormatado;

        listaMoedas.appendChild(optionMoeda);
    }
}

function buscarCotacaoEntrada() {
    paresMoedas.forEach(function (par) {
        var moedaEntrada = document.getElementById(par.listaMoedasId).value;
        var valor = document.getElementById(par.valorId).value;
        var xhr = new XMLHttpRequest();

        if (moedaEntrada == 'BRL') {
            conversao = valor;
            console.log(conversao);
        } else {
            xhr.open("GET", "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='" + moedaEntrada + "'&@dataCotacao='" + dataAt + "'&$top=100&$format=json&$select=paridadeCompra,paridadeVenda,cotacaoCompra,cotacaoVenda,dataHoraCotacao,tipoBoletim");
            xhr.addEventListener("load", function () {
                let resposta = xhr.responseText;
                let moedas = JSON.parse(resposta);
                console.log("moedas");
                console.log(moedas);

                let tamanho = moedas.value.length;

                conversao = valor * moedas.value[tamanho - 1].cotacaoCompra;
                console.log(conversao);
            });
            xhr.send();
        }

        buscarCotacaoSaida(par.conversaoId);
    });
}

function buscarCotacaoSaida(conversaoId) {
    var moedaSaida = document.getElementById(conversaoId).value;
    var xhr = new XMLHttpRequest();

    if (moedaSaida == 'BRL') {
        document.getElementById(conversaoId).value = "Conversão: " + conversao.toFixed(2);
    } else {
        xhr.open("GET", "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='" + moedaSaida + "'&@dataCotacao='" + dataAt + "'&$top=100&$format=json&$select=paridadeCompra,paridadeVenda,cotacaoCompra,cotacaoVenda,dataHoraCotacao,tipoBoletim");
        xhr.addEventListener("load", function () {
            let resposta = xhr.responseText;
            let moedas = JSON.parse(resposta);
            console.log("moedas");
            console.log(moedas);

            let tamanho = moedas.value.length;

            var conversaoSaida = conversao / moedas.value[tamanho - 1].cotacaoVenda;
            console.log(conversaoSaida);
            document.getElementById(conversaoId).value = "Conversão: " + conversaoSaida.toFixed(2);
        });
        xhr.send();
    }
}

function dataAtual() {
    const date = new Date();
    const ano = date.getFullYear();
    const dia = date.getDate();
    const mes = date.getMonth() + 1;
    var data = (mes + "-" + dia + "-" + ano);
    return data;
}