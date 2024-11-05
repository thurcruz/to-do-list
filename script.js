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
        const deleteBtn = $("<button></button>")
            .addClass("delete-task")
            .html("<ion-icon name='trash-outline'></ion-icon>"); // Ícone da lixeira

        if (completed) {
            taskItem.addClass("completed");
        }

        taskItem.append($("<input type='checkbox'>").prop("checked", completed))
                .append(taskSpan)
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
        if (event.which === 13) { // Código da tecla Enter
            $("#add-task").click(); // Simula o clique no botão
        }
    });

    // Marcar como concluída ou remover
    $("#task-list").on("change", "input[type='checkbox']", function() {
        $(this).closest(".todo-item").toggleClass("completed");
        saveTasks();
    });

    $("#task-list").on("click", ".delete-task", function() {
        $(this).closest(".todo-item").remove();
        saveTasks();
    });

    // Mostrar mensagem após 5 segundos
    setTimeout(function() {
        $("#message").fadeIn();
    }, 5000);

    // Carregar tarefas ao carregar a página
    loadTasks();
});
