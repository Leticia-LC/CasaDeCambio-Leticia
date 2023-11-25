var botao = document.getElementById("idButton")
buscarMoedasAJAX(carregarSelectMoedas1);
buscarMoedasAJAX(carregarSelectMoedas2);

botao.addEventListener("click", buscarCotacaoEntrada)
var dataAt = dataAtual()
var conversao1;


function buscarMoedasAJAX(carregarSelectMoedas) {
    var xhr = new XMLHttpRequest()
    xhr.open("GET", "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/Moedas?$top=100&$format=json&$select=simbolo,nomeFormatado,tipoMoeda")


    xhr.addEventListener("load", function () {
        let resposta = xhr.responseText
        let moedas = JSON.parse(resposta)
        carregarSelectMoedas(moedas)
    })
    xhr.send()
}
function carregarSelectMoedas1(moedas) {
    let listaMoedas = document.getElementById("idMoedas")
    for (let i = 0; i < moedas.value.length; i++) {
        let optionMoeda = document.createElement("option")
        optionMoeda.value = moedas.value[i].simbolo
        optionMoeda.innerText = moedas.value[i].nomeFormatado


        listaMoedas.appendChild(optionMoeda)
    }
}
function carregarSelectMoedas2(moedas) {
    let listaMoedas2 = document.getElementById("idMoedas2")
    for (let i = 0; i < moedas.value.length; i++) {
        let optionMoeda = document.createElement("option")
        optionMoeda.value = moedas.value[i].simbolo
        optionMoeda.innerText = moedas.value[i].nomeFormatado
        listaMoedas2.appendChild(optionMoeda)
    }
}


function buscarCotacaoEntrada() {
    var moedaEntrada = document.getElementById("idMoedas").value
    var valor = document.getElementById("idValor").value
    var xhr = new XMLHttpRequest()


    if (moedaEntrada == 'BRL') {
        conversao1 = valor;
    } else {
        xhr.open("GET", "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='" + moedaEntrada + "'&@dataCotacao='" + dataAt + "'&$top=100&$format=json&$select=paridadeCompra,paridadeVenda,cotacaoCompra,cotacaoVenda,dataHoraCotacao,tipoBoletim")
        xhr.addEventListener("load", function () {
            let resposta = xhr.responseText
            let moedas = JSON.parse(resposta)

            let tamanho = moedas.value.length
            conversao1 = valor * moedas.value[tamanho - 1].cotacaoCompra;

        })
        xhr.send()
    }
    buscarCotacaoSaida()
}

function dataAtual() {
    const date = new Date();
    const ano = date.getFullYear();
    const dia = date.getDate();
    const mes = date.getMonth() + 1;
    var data = (mes + "-" + dia + "-" + ano)
    return data
}

function buscarCotacaoSaida() {
    var moedaSaida = document.getElementById("idMoedas2").value
    var xhr = new XMLHttpRequest()
    var conversao2;


    if (moedaSaida == 'BRL') {
        conversao2 = conversao1;
        console.log(conversao2)
        document.getElementById("idOut").value = "Conversão: " + conversao2.toFixed(2);
    } else {
        xhr.open("GET", "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='" + moedaSaida + "'&@dataCotacao='" + dataAt + "'&$top=100&$format=json&$select=paridadeCompra,paridadeVenda,cotacaoCompra,cotacaoVenda,dataHoraCotacao,tipoBoletim")


        xhr.addEventListener("load", function () {
            let resposta = xhr.responseText
            let moedas = JSON.parse(resposta)

            let tamanho = moedas.value.length
            conversao2 = conversao1 / (moedas.value[tamanho - 1].cotacaoVenda);
            document.getElementById("idOut").value = "Conversão: " + conversao2.toFixed(2);
        })
        xhr.send()
        document.getElementById("idOut").value = "Conversão: " + conversao2.toFixed(2);
    }
}

