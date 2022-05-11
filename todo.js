//todo list adding
const input = document.querySelector("#todo_list_input");
const btn = document.querySelector(".todo_btn");
const list = document.querySelector(".todo_add ul");
const main_container = document.querySelector(".main_details");
const update_todo = document.querySelector(".update_form");
const pending = document.querySelector(".pending");
const completed = document.querySelector(".completed");
const totalTodos = document.querySelector(".totalTodo");
const url_main = "https://todobyram.herokuapp.com/Data";
let sortingCompleted = false;
let editTodoId;

//completed todo_list
let pedndingTask = false;
async function sortTodo() {
  const completeData = await fetch(`${url_main}?completed=${sortingCompleted}`);
  const filteredData = await completeData.json();
  list.innerHTML = "";
  filteredData.forEach((element) => addingList(element));
}

const forComplete_todo = document.querySelector(".completed");
forComplete_todo.addEventListener("click", () => {
  sortingCompleted = true;
  sortTodo();
});

//pednding todo_list
pending.addEventListener("click", () => {
  sortingCompleted = false;
  sortTodo();
});

//total_todo list

totalTodos.addEventListener("click", () => {
  displaying_data();
});

function addingList(i) {
  const crt_li = document.createElement("li");
  list.appendChild(crt_li);

  const para = document.createElement("p");
  para.textContent = i.name;
  crt_li.appendChild(para);
  para.style.textDecoration = i.completed ? "line-through" : "none";
  para.style.opacity = i.completed ? "0.2" : "1";

  const iconsContainer = document.createElement("div");
  crt_li.appendChild(iconsContainer);
  iconsContainer.style.opacity = i.completed ? "0.2" : "1";

  const check = document.createElement("div");
  check.classList.add("complete");
  check.innerHTML = `<i class='bx bx-check bx-tada bx-flip-vertical' style='color:#000'></i>`;
  iconsContainer.appendChild(check);
  check.addEventListener("click", function (k) {
    complete_display(i.id);
  });

  const edit = document.createElement("div");
  edit.classList.add("update");
  edit.innerHTML = `<i class='bx bxs-pen bx-tada' style='color:+#ffffff' ></i>`;
  iconsContainer.appendChild(edit);
  edit.addEventListener("click", function () {
    main_container.style.opacity = "0";
    update_todo.style.opacity = "1";
    editTodoId = i.id;
  });

  const dele = document.createElement("div");
  dele.classList.add("delete");
  dele.innerHTML = `<i class='bx bx-trash bx-flip-horizontal bx-tada' style='color:#ABF4D7' ></i>`;
  iconsContainer.appendChild(dele);
  dele.addEventListener("click", function (event) {
    event.target.closest("li").remove();
    dele_data(i.id);
  });
  input.value = "";
}

btn.addEventListener("click", async function () {
  if (input.value !== "") {
    const todo_Data = await fetch(`${url_main}`);
    const json_todo = await todo_Data.json();
    const duplicate_todo = json_todo.find((each) => each.name === input.value);
    if (duplicate_todo === undefined) {
      sendData();
      displaying_data();
    } else {
      alert("Already Exited Entry");
    }
  }
});

//filtering todo_data
async function complete_display(todoId) {
  const url = `${url_main}/` + todoId;
  const backendElement = await fetch(url);
  const backendLi = await backendElement.json();
  const updatedTodo = {
    name: backendLi.name,
    completed: !backendLi.completed,
    id: backendLi.id,
  };
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedTodo),
  });
  displaying_data();
}

//todo_list fetch data
// fetch("http://localhost:3000/Data")
//   .then((data) => {
//     return data.json();
//   })
//   .then((data_1) => {
//     console.log(data_1);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

//displaying fetch data
async function displaying_data() {
  document.querySelector(`.loading`).classList.remove(`hidden`);
  setTimeout(async function () {
    document.querySelector("ul").innerHTML = "";
    const forData = await fetch(`${url_main}`);
    const for_Json_Data = await forData.json();
    for_Json_Data.forEach((element) => addingList(element));
    document.querySelector(`.loading`).classList.add(`hidden`);
  }, 50);
}
displaying_data();

//adding data to backend
async function sendData() {
  link = `${url_main}`;
  console.log(input.value);
  details = { name: input.value, completed: false };
  const resp = await fetch(link, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(details),
  });
  displaying_data();
}

//delete backend data..
async function dele_data(dta) {
  link = `${url_main}/` + dta;
  const deleting = await fetch(link, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
    },
  });
  displaying_data();
}

//edit-btn functionality for todo
const editInput = document.querySelector(".update_input");
async function editTodo() {
  const url = `${url_main}/` + editTodoId;
  const backendElement = await fetch(url);
  const backendLi = await backendElement.json();
  const updatedTodo = {
    name: editInput.value,
    completed: backendLi.completed,
    id: backendLi.id,
  };
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedTodo),
  });
  main_container.style.opacity = "1";
  update_todo.style.opacity = "0";
  displaying_data();
}
const editTodoBtn = document.querySelector(".update_btn");
editTodoBtn.addEventListener("click", editTodo);
