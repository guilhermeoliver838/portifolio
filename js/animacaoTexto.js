/* =========================================================
   ANIMAÇÃO DE DIGITAÇÃO DO TEXTO INICIAL
   ========================================================= */

/* Lista de frases que serão exibidas na Home */
const palavras = [
    "Desenvolvedor",
    "Amante da Tecnologia",
    "Formado em ADS",
    "Músico nas horas vagas"
];

/* Configurações de velocidade, em milissegundos */
const velocidadeDigitacao = 100;
const velocidadeApagamento = 50;
const pausaPalavraCompleta = 1500;
const pausaAntesDeDigitar = 300;

/*
   Inicia a animação somente quando o elemento HTML existir.
   Isso é importante porque a Home é carregada dinamicamente.
*/
function iniciarAnimacaoTexto() {
    const elementoTexto = document.getElementById("texto-digitado");

    /* Evita iniciar se o elemento não existir */
    if (!elementoTexto) {
        return false;
    }

    /* Evita iniciar a mesma animação mais de uma vez */
    if (elementoTexto.dataset.animacaoIniciada === "true") {
        return true;
    }

    elementoTexto.dataset.animacaoIniciada = "true";

    /* Controla a frase atual e a quantidade de letras exibidas */
    let indicePalavra = 0;
    let indiceLetra = 0;

    /* Indica se o texto está sendo apagado */
    let apagando = false;

    /* Executa cada etapa da animação */
    function animarTexto() {
        const palavraAtual = palavras[indicePalavra];

        /* Adiciona ou remove uma letra */
        if (apagando) {
            indiceLetra--;
        } else {
            indiceLetra++;
        }

        /* Exibe somente a parte da frase já digitada */
        elementoTexto.textContent =
            palavraAtual.substring(0, indiceLetra);

        /* Quando a frase estiver completa, aguarda para apagá-la */
        if (!apagando && indiceLetra === palavraAtual.length) {
            setTimeout(() => {
                apagando = true;
                animarTexto();
            }, pausaPalavraCompleta);

            return;
        }

        /* Quando a frase estiver totalmente apagada */
        if (apagando && indiceLetra === 0) {
            apagando = false;

            /* Avança para a próxima frase e volta ao início da lista */
            indicePalavra = (indicePalavra + 1) % palavras.length;

            setTimeout(animarTexto, pausaAntesDeDigitar);
            return;
        }

        /* Escolhe a velocidade conforme a ação atual */
        const velocidade = apagando
            ? velocidadeApagamento
            : velocidadeDigitacao;

        /* Agenda a próxima letra */
        setTimeout(animarTexto, velocidade);
    }

    /* Começa a primeira frase */
    animarTexto();

    return true;
}

/*
   Tenta iniciar a animação.
   Se a Home ainda não tiver sido inserida pelo loadSections.js,
   observa o documento até encontrar o elemento.
*/
if (!iniciarAnimacaoTexto()) {
    const observador = new MutationObserver(() => {
        if (iniciarAnimacaoTexto()) {
            observador.disconnect();
        }
    });

    observador.observe(document.body, {
        childList: true,
        subtree: true
    });
}
