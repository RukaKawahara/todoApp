console.log("class.jsが読み込まれています");

class Todo {
  // コンストラクタの定義
  constructor(options) {
    this.inputElement = options.inputElement;
    this.todoCount = options.todoCount;
    this.todoItemListUl = options.todoItemListUl;
    this.todoObject = {};
    this.todoListArray = [];
  }

  //メソッドの定義

  /**
 * [addTodo todoを追加する]
 */
  addTodo() {
    const inputText = this.inputElement.value.trim();

    if(inputText === ''){
      alert("タスクを入力してください");
      return;
    };

    this.todoObject = {
      text: inputText,
      id: new Date().getTime(),
      checked: false,
    };

    this.todoListArray.push({...this.todoObject});
  }

  /**
 * [createTodo 追加するtodoのhtmlを生成する]
 */
  createTodo() {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('todo-list-checkbox', 'js-todo-list-checkbox');
    checkbox.checked = this.todoObject.checked;
    checkbox.id = this.todoObject.id;
    checkbox.addEventListener('click', (e) => {
      this.toggleChecked(e.target.id);
    })

    // <li>要素を生成
    const todoItem = document.createElement('li');
    todoItem.classList.add('todo-list-li');
    todoItem.dataset.id = this.todoObject.id;

    // <label>要素を生成
    const label = document.createElement('label');
    label.classList.add("todo-list-label");
    label.htmlFor = this.todoObject.id;
    label.textContent = this.todoObject.text;
    label.prepend(checkbox);

    // <button>要素を生成
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.dataset.id = this.todoObject.id;
    deleteButton.textContent = "削除";
    deleteButton.addEventListener('click', (e) => {
      this.deleteTodo(e.target.dataset.id);
    })

    todoItem.appendChild(label);
    todoItem.appendChild(deleteButton);

    // <ul>に作った要素を格納
    this.todoItemListUl.appendChild(todoItem);
  }

  /**
 * [toggleChecked チェックされたtodoの状態を切り替える]
 * @param {string} id チェックされたtodoのid
 */
  toggleChecked(id) {
    const foundIndex = this.todoListArray.findIndex(obj => obj.id == id);
    if(foundIndex !== -1){
      this.todoListArray[foundIndex].checked = !this.todoListArray[foundIndex].checked;
    }
  }

  /**
 * [deleteTodo チェックされたtodoを削除する]
 * @param {string} id 削除されるtodoのid
 */
  deleteTodo(id) {
    const dataListItems = document.querySelector(`li[data-id="${id}"]`);
    dataListItems.forEach(item => item.remove());
    // データの更新
    const newtodoListArray = this.todoListArray.filter(todo => todo.id != id);
    this.todoListArray = [...newtodoListArray];
    this.updateTodoNum();
  }

  /**
 * [updateTodoNum Todoアイテム数を更新する]
 */
  updateTodoNum() {
    this.todoCount.textContent = this.todoListArray.length;
  }
}

// /**
//  * インスタンスを生成
//  */
const todo = new Todo({
  inputElement : document.querySelector('#js-form-input'),
  todoCount : document.querySelector('#js-todo-length'),
  todoItemListUl : document.querySelector('#js-todo-list-ul')
});

// /**
//  * controller
//  */
document.querySelector('#js-form').addEventListener('submit', (event) => {
  event.preventDefault();
  // データを生成
  todo.addTodo();
  // 追加するtodolistの見た目を作る
  todo.createTodo();
  // inputエリアを空にする
  todo.inputElement.value = '';
  //カウント数の更新
  todo.updateTodoNum();
});