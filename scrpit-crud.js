const botaoNovaTarefa = document.querySelector(".app__button--add-task");
const formularioNovaTarefa = document.querySelector(".app__form-add-task");
const textArea = document.querySelector(".app__form-textarea");
const listaTarefas = document.querySelector(".app__section-task-list");
const tarefaEmAndamento = document.querySelector(".app__section-active-task-description");
const botaoRemoverConcluidas = document.getElementById("btn-remover-concluidas");
const botaoRemoverTodas = document.getElementById("btn-remover-todas");

let tarefaSelecionada = null;
let liTarefaSelecionada = null;

let tarefas = JSON.parse(localStorage.getItem("listaTarefas")) || [];

function setBanco() {
    localStorage.setItem("listaTarefas", JSON.stringify(tarefas));
}

function criarElementoTarefa(tarefa) {
 
    const elementoTarefa = document.createElement("li");
    elementoTarefa.classList.add("app__section-task-list-item");

    const svg = document.createElement("svg");
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `
    const descricao = document.createElement("p");
    descricao.classList.add("app__section-task-list-item-description");
    descricao.textContent = tarefa.descricao;

    const botaoEditar = document.createElement("button");
    botaoEditar.classList.add("app_button-edit");

    botaoEditar.onclick = () => {
        const novoTexto = prompt("Novo nome da tarefa:");

        if(novoTexto) {
            descricao.textContent = novoTexto;
            tarefa.descricao = novoTexto;
            setBanco();
        }

    }
    
    const imagemBotao = document.createElement("img");
    imagemBotao.setAttribute("src", "/imagens/edit.png");
    botaoEditar.append(imagemBotao);

    elementoTarefa.append(svg);
    elementoTarefa.append(descricao);
    elementoTarefa.append(botaoEditar);

    if(tarefa.complete) {
        elementoTarefa.classList.add("app__section-task-list-item-complete");
        elementoTarefa.querySelector("button").setAttribute("disabled", "disabled");
    } else {
        elementoTarefa.onclick = () => {
            const tarefasSujas = document.querySelectorAll(".app__section-task-list-item");
            tarefasSujas.forEach(tarefa => {
                    tarefa.classList.remove("app__section-task-list-item-active");
                })
    
            if(tarefaSelecionada === tarefa) {
                tarefaEmAndamento.textContent = "";
                tarefaSelecionada = null;
                liTarefaSelecionada = null;
                return;
            }
    
            tarefaSelecionada = tarefa;
            liTarefaSelecionada = elementoTarefa;
            tarefaEmAndamento.textContent = tarefa.descricao;
            elementoTarefa.classList.add("app__section-task-list-item-active");
        }
    }


    return elementoTarefa;
}

botaoNovaTarefa.addEventListener("click", () => {
    formularioNovaTarefa.classList.toggle("hidden");
})

formularioNovaTarefa.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const tarefa = {
        descricao: textArea.value,
    }

    tarefas.push(tarefa);

    const elementoTarefa = criarElementoTarefa(tarefa);
    listaTarefas.appendChild(elementoTarefa);

    setBanco();

    textArea.value = "";

    formularioNovaTarefa.classList.add("hidden");
})

tarefas.forEach(tarefa => {
    const elementoTarefa = criarElementoTarefa(tarefa);
    listaTarefas.appendChild(elementoTarefa);
})

document.addEventListener("FocoFinalizado", () => {
    if(tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove("app__section-task-list-item-active");
        liTarefaSelecionada.classList.add("app__section-task-list-item-complete");
        liTarefaSelecionada.querySelector("button").setAttribute("disabled", "disabled");
        tarefaSelecionada.complete = true;
        setBanco()
    }
})

const removerTarefas = (somenteCompletas) => {
    const seletor = somenteCompletas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item";
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove();
    })
    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.complete) : [];
    setBanco();
}

botaoRemoverConcluidas.onclick = () => removerTarefas(true);
botaoRemoverTodas.onclick = () => removerTarefas(false);