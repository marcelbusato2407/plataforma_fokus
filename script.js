const html = document.querySelector('html');
const botaoFoco = document.querySelector('.app__card-button--foco');
const botaoCurto = document.querySelector('.app__card-button--curto');
const botaoLongo = document.querySelector('.app__card-button--longo');
const botoes = document.querySelectorAll('.app__card-button');
const botaoMusica = document.querySelector('#alternar-musica');
const botaoComecar = document.querySelector('#start-pause');
const imagemFundo = document.querySelector('.app__image');
const imagemBotao = document.querySelector('.app__card-primary-butto-icon');
const textoBotao = document.querySelector('.app__card-primary-button span');
const titulo = document.querySelector('.app__title');
const timer = document.querySelector('#timer');

const musica = new Audio('/sons/luna-rise-part-one.mp3');
const audioPlay = new Audio('/sons/play.wav');
const audioPause = new Audio('/sons/pause.mp3');
const audioZerou = new Audio('/sons/beep.mp3');

let tempoDecorridoEmSegundos = 5;
let intervaloId = null;

musica.loop = true;
botaoMusica.addEventListener('change', () => {
    if(musica.paused) {
        musica.play();
    } else {
        musica.pause();
    }
})

botaoFoco.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 5;
    alterarContexto('foco');
    botaoFoco.classList.add('active');
    zerar();
    audioPause.play();
    imagemBotao.setAttribute('src', '/imagens/play_arrow.png');
    textoBotao.textContent = 'Começar';
})

botaoCurto.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 5;
    alterarContexto('descanso-curto');
    botaoCurto.classList.add('active');
    zerar();
    audioPause.play();
    imagemBotao.setAttribute('src', '/imagens/play_arrow.png');
    textoBotao.textContent = 'Começar';
});

botaoLongo.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 15;
    alterarContexto('descanso-longo');
    botaoLongo.classList.add('active');
    zerar();
    audioPause.play();
    imagemBotao.setAttribute('src', '/imagens/play_arrow.png');
    textoBotao.textContent = 'Começar';
})

function alterarContexto(contexto) {
    atualizaTimer();

    botoes.forEach(function(contexto) {
        contexto.classList.remove('active');
    })

    html.setAttribute('data-contexto', contexto);
    imagemFundo.setAttribute('src', `/imagens/${contexto}.png`);

    switch(contexto) {
        case "foco":
            titulo.innerHTML = `
            Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>
            `
            break;
        case "descanso-curto":
            titulo.innerHTML = `
            Que tal dar uma respirada?<br>
                <strong class="app__title-strong">Faça uma pausa curta!</strong>
            `
            break;
        case "descanso-longo":
            titulo.innerHTML = `
            Hora de voltar à superfície.<br>
                <strong class="app__title-strong">Faça uma pausa longa.</strong>
            `
            break;
    }
}

const contagemRegressiva = () => {
    if(tempoDecorridoEmSegundos <= 0) {
        //audioZerou.play();
        alert('Tempo estourado');
        const focoAtivo = html.getAttribute("data-contexto") == "foco";
        if(focoAtivo) {
            const evento = new CustomEvent("FocoFinalizado");
            document.dispatchEvent(evento);
        }
        zerar();
        return;
    }

    tempoDecorridoEmSegundos -= 1;
    atualizaTimer();
}

botaoComecar.addEventListener('click', iniciarOuPausar);

function iniciarOuPausar() {
    //pausar
    if(intervaloId) {
        zerar();
        audioPause.play();
        imagemBotao.setAttribute('src', '/imagens/play_arrow.png');
        textoBotao.textContent = 'Começar';
        return;
    }
    audioPlay.play();
    imagemBotao.setAttribute('src', '/imagens/pause.png');
    textoBotao.textContent = 'Pausar';
    intervaloId = setInterval(contagemRegressiva, 1000)
}

function zerar() {
    clearInterval(intervaloId);
    intervaloId = null;
}

function atualizaTimer() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-br', {minute: '2-digit', second: '2-digit'});
    timer.innerHTML = `${tempoFormatado}`;
}

atualizaTimer();