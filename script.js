$(document).ready(function() {
    // Função para carregar tarefas de cookies
    function loadTasks() {
        const tasks = JSON.parse(getCookie("tasks") || "[]");
        tasks.forEach(task => addTaskToDOM(task.text, task.completed));
    }

    // Função para salvar tarefas em cookies
    function saveTasks() {
        const tasks = [];
        $("#task-list li").each(function() {
            tasks.push({
                text: $(this).find("span").text(),
                completed: $(this).hasClass("completed")
            });
        });
        setCookie("tasks", JSON.stringify(tasks), 7);
    }

    // Funções de cookies
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = name + "=" + value + ";expires=" + date.toUTCString() + ";path=/";
    }

    function getCookie(name) {
        const cookieArr = document.cookie.split(";");
        for (let cookie of cookieArr) {
            let pair = cookie.trim().split("=");
            if (pair[0] === name) return pair[1];
        }
        return null;
    }

    // Adiciona uma tarefa ao DOM
    function addTaskToDOM(taskText, completed = false) {
        const taskItem = $("<li></li>").addClass("todo-item");
        const taskSpan = $("<span></span>").text(taskText);
        const deleteBtn = $("<button></button>").addClass("delete-task").html("<ion-icon name='trash-outline'></ion-icon>");
        const editBtn = $("<button></button>").addClass("edit-task").html("<ion-icon name='pencil-outline'></ion-icon>");
        
        if (completed) {
            taskItem.addClass("completed");
        }

        taskItem.append($("<input type='checkbox'>").prop("checked", completed))
                .append(taskSpan)
                .append(editBtn)
                .append(deleteBtn);
        $("#task-list").append(taskItem);
    }

    // Adicionar tarefa
    $("#add-task").click(function() {
        const taskText = $("#task-input").val().trim();
        if (taskText !== "") {
            addTaskToDOM(taskText);
            saveTasks();
            $("#task-input").val("");
        }
    });

    // Adicionar tarefa pressionando Enter
    $("#task-input").keypress(function(event) {
        if (event.which === 13) {
            $("#add-task").click(); // Simula o clique no botão
        }
    });

    // Editar tarefa
    $("#task-list").on("click", ".edit-task", function() {
        const taskItem = $(this).closest(".todo-item");
        const taskText = taskItem.find("span").text();

        // Substitui o texto da tarefa por um input para edição
        const inputEdit = $("<input>").addClass("task-input-edit").val(taskText);

        // Substitui o span pela input
        taskItem.find("span").replaceWith(inputEdit);

        // Troca o botão de editar para salvar
        $(this).html("<ion-icon name='checkmark-outline'></ion-icon>").removeClass("edit-task").addClass("save-task");
    });

    // Salvar edição de tarefa
    $("#task-list").on("click", ".save-task", function() {
        const taskItem = $(this).closest(".todo-item");
        const editedText = taskItem.find(".task-input-edit").val();

        // Substitui o input pelo novo texto
        const taskSpan = $("<span></span>").text(editedText);
        taskItem.find(".task-input-edit").replaceWith(taskSpan);

        // Troca o botão de salvar para editar novamente
        $(this).html("<ion-icon name='pencil-outline'></ion-icon>").removeClass("save-task").addClass("edit-task");

        saveTasks();
    });

    // Excluir tarefa
    $("#task-list").on("click", ".delete-task", function() {
        $(this).closest(".todo-item").remove();
        saveTasks();
    });

   // Mostrar mensagem após 5 segundos
   setTimeout(function() {
    $("#message").fadeIn();
}, 5000);

    // Carregar as tarefas ao iniciar
    loadTasks();
});
