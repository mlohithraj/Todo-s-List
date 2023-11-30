const myform = document.querySelector("#myform");
  const myName = document.querySelector("#name");
  const mydescription = document.querySelector("#description");

  const taskRemaining = document.querySelector(".items1");
  const taskDone = document.querySelector(".items2");

  const apiUrl =
    "https://crudcrud.com/api/5a25f35d387641ed986e39a6bbef1099/todo";

  function createTodoElement(task) {
    const li = document.createElement("li");
    li.dataset.name = task.name; 
    li.dataset.description = task.description;

    li.appendChild(
      document.createTextNode(`${task.name} : ${task.description}`)
    );

    const delButton = createButton("&#10006;");
    delButton.style.backgroundColor = "white";
    delButton.style.color = "red";
    li.appendChild(delButton);

    const tickButton = createButton("&#x2714;");
    tickButton.style.backgroundColor = "white";
    tickButton.style.color = "green";
    li.appendChild(tickButton);

    const taskId = task._id;

    delButton.addEventListener("click", function () {
      deleteTask(taskId, li);
    });

    tickButton.addEventListener("click", function () {
      moveTaskToDone(taskId, li);
    });

    taskRemaining.appendChild(li);
  }

  function createButton(innerHtml) {
    const button = document.createElement("button");
    button.innerHTML = innerHtml;
    return button;
  }

  function deleteTask(taskId, taskElement) {
    axios
      .delete(`${apiUrl}/${taskId}`)
      .then((response) => {
        console.log(response);
        taskElement.remove();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function moveTaskToDone(taskId, taskElement) {
    const taskData = {
      name: taskElement.dataset.name,
      description: taskElement.dataset.description,
      status: false,
    };

    axios
      .put(`${apiUrl}/${taskId}`, taskData)
      .then((response) => {
        console.log(response.data);
        taskRemaining.removeChild(taskElement); 
        taskDone.appendChild(taskElement); 
        taskElement.removeChild(taskElement.querySelector("button")); 
        taskElement.removeChild(taskElement.querySelector("button")); 
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function addTodo() {
    const todoData = {
      name: myName.value,
      description: mydescription.value,
      status: true,
    };

    axios
      .post(apiUrl, todoData)
      .then((response) => {
        console.log(response);
        createTodoElement(response.data);
      })
      .catch((err) => {
        console.log(err);
      });

    myName.value = "";
    mydescription.value = "";
  }

  myform.addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo();
  });

  function createDoneElement(task) {
    const li = document.createElement("li");
    li.appendChild(
      document.createTextNode(`${task.name} : ${task.description}`)
    );

    taskDone.appendChild(li);
  }

window.addEventListener("DOMContentLoaded", () => {
  axios
    .get(apiUrl)
    .then((response) => {
      console.log(response);

      const remainingTasks = response.data.filter(
        (task) => task.status === true
      );
      const doneTasks = response.data.filter(
        (task) => task.status === false);

      for (const task of remainingTasks) {
        createTodoElement(task);
      }

      for (const task of doneTasks) {
        createDoneElement(task);
      }
    })
    .catch((error) => {
      console.log(error);
    });
});