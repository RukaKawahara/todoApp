console.log("function.jsが読み込まれています");

const formElement = document.querySelector('#js-form');
const inputElement = document.querySelector('#js-form-input');
const todoCount = document.querySelector('#js-todo-length');
const todoItemListUl = document.querySelector('#js-todo-list-ul');
let todo = {};
let todoListArray = [];

const addTodo = () => {
  // input要素の中身を取得
  var inputText = inputElement.value.trim();

  if(inputText === ''){
    alert("タスクを入力してください");
    return;
  };

  todo = {
    text: inputText,
    id: new Date().getTime(),
    checked: false,
  };

  todoListArray.push({...todo});
}

const createTodo = (todo) => {
  // checkboxのhtmlを生成する
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.classList.add('todo-list-checkbox', 'js-todo-list-checkbox');
  checkbox.checked = todo.checked;
  checkbox.id = todo.id;
  checkbox.addEventListener('click', (e) => {
    toggleChecked(e.target.id);
  })

  // <li>要素を生成
  const todoItem = document.createElement('li');
  todoItem.classList.add('todo-list-li');
  todoItem.dataset.id = todo.id;

  // <label>要素を生成
  const label = document.createElement('label');
  label.classList.add("todo-list-label");
  label.htmlFor = todo.id;
  label.textContent = todo.text;
  label.prepend(checkbox);

  // <button>要素を生成
  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.dataset.id = todo.id;
  deleteButton.textContent = "削除";
  deleteButton.addEventListener('click', (e) => {
    deleteTodo(e.target.dataset.id);
  })

  todoItem.appendChild(label);
  todoItem.appendChild(deleteButton);

  // <ul>に作った要素を格納
  todoItemListUl.appendChild(todoItem);
}

const toggleChecked = (id) => {
  // データの更新
  var foundIndex = todoListArray.findIndex(obj => obj.id == id);
  if(foundIndex !== -1){
    todoListArray[foundIndex].checked = !todoListArray[foundIndex].checked;
  }
}

const deleteTodo = (id) => {
  var dataListItems = document.querySelectorAll(`li[data-id="${id}"]`);
  dataListItems.forEach(item => item.remove());
  // データの更新
  const newtodoListArray = todoListArray.filter(todo => todo.id != id);
  todoListArray = [...newtodoListArray];
  updateTodoNum();
}

const updateTodoNum = () => {
  todoCount.textContent = todoListArray.length;
}

/**
* controller
*/
formElement.addEventListener('submit', (event) => {
  event.preventDefault();
  // データを生成
  addTodo();
  // 追加するtodolistの見た目を作る
  createTodo(todo);
  // inputエリアを空にする
  inputElement.value = '';
  //カウント数の更新
  updateTodoNum();
});
