console.log("prototype.jsが読み込まれています");

/**
 * [Todo コンストラクタを生成]
 *
 * @param {Object} options.inputElement input欄
 * @param {Object} options.todoCount Todoアイテム数
 * @param {Object} options.todoItemListUl	todoListが表示されるul要素
 */
const Todo = function(options){
  'use strict';

  const self = this;

  self.inputElement = options.inputElement;
  self.todoCount = options.todoCount;
  self.todoItemListUl = options.todoItemListUl;
  self.todoObject = {};
  self.todoListArray = [];
}

/**
 * [addTodo todoを追加する]
 * @param {string} inputText inputに入力されたテキスト
 */
Todo.prototype.addTodo = function() {
  'use strict';

  const self = this;
  const inputText = self.inputElement.value.trim();

  if(inputText === ''){
    alert("タスクを入力してください");
    return;
  };

  self.todoObject = {
    text: inputText,
    id: new Date().getTime(),
    checked: false,
  };

  self.todoListArray.push({...self.todoObject});
}

/**
 * [createTodo 追加するtodoのhtmlを生成する]
 */
Todo.prototype.createTodo = function() {
  'use strict';

  const self = this;
  // checkboxのhtmlを生成する
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.classList.add('todo-list-checkbox', 'js-todo-list-checkbox');
  checkbox.checked = self.todoObject.checked;
  checkbox.id = self.todoObject.id;
  checkbox.addEventListener('click', (e) => {
    todo.toggleChecked(e.target.id);
  })

  // <li>要素を生成
  const todoItem = document.createElement('li');
  todoItem.classList.add('todo-list-li');
  todoItem.dataset.id = self.todoObject.id;

  // <label>要素を生成
  const label = document.createElement('label');
  label.classList.add("todo-list-label");
  label.htmlFor = self.todoObject.id;
  label.textContent = self.todoObject.text;
  label.prepend(checkbox);

  // <button>要素を生成
  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.dataset.id = self.todoObject.id;
  deleteButton.textContent = "削除";
  deleteButton.addEventListener('click', (e) => {
    todo.deleteTodo(e.target.dataset.id);
  })

  todoItem.appendChild(label);
  todoItem.appendChild(deleteButton);

  // <ul>に作った要素を格納
  self.todoItemListUl.appendChild(todoItem);
}

/**
 * [toggleChecked チェックされたtodoの状態を切り替える]
 * @param {string} id チェックされたtodoのid
 */
Todo.prototype.toggleChecked = function(id) {
  'use strict';

  const self = this;

  // データの更新
  const foundIndex = self.todoListArray.findIndex(obj => obj.id == id);
  if(foundIndex !== -1){
    self.todoListArray[foundIndex].checked = !self.todoListArray[foundIndex].checked;
  }
}

/**
 * [deleteTodo チェックされたtodoを削除する]
 * @param {string} id 削除されるtodoのid
 */
Todo.prototype.deleteTodo = function(id) {
  'use strict';

  const self = this;
  const dataListItems = document.querySelector(`li[data-id="${id}"]`);
  dataListItems.forEach(item => item.remove());
  // データの更新
  const newtodoListArray = self.todoListArray.filter(todo => todo.id != id);
  self.todoListArray = [...newtodoListArray];
  todo.updateTodoNum();
}

/**
 * [updateTodoNum Todoアイテム数を更新する]
 */
Todo.prototype.updateTodoNum = function() {
  'use strict';

  const self = this;
  self.todoCount.textContent = self.todoListArray.length;
}

// /**
//  * インスタンスを生成
//  */
const todo = new Todo({
  inputElement : document.querySelector('#js-form-input'),
  todoCount : document.querySelector('#js-todo-length'),
  todoItemListUl : document.querySelector('#js-todo-list-ul'),
});

// /**
//  * controller
//  */
document.querySelector('#js-form').addEventListener('submit', (event) => {
  event.preventDefault();
  // input要素の中身を取得
  const inputText = todo.inputElement.value.trim();

  // 入力されたテキストが空だったら処理から抜ける
  if(inputText === ''){
    alert("タスクを入力してください");
    return;
  };

  // データを生成
  todo.addTodo(inputText);
  // 追加するtodolistの見た目を作る
  todo.createTodo();
  // inputエリアを空にする
  todo.inputElement.value = '';
  //カウント数の更新
  todo.updateTodoNum();
});
