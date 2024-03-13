export const todoApp = () => {
  // `id='js-form'`の要素を取得
  const formElement = document.querySelector('#js-form');
  const inputElement = document.querySelector('#js-form-input');
  const todoCount = document.querySelector('#js-todo-length');
  const todoItemListUl = document.querySelector('#js-todo-list-ul');
  let todoListArray = [];
  let todoId = 0;
  let inputText;

  const updateTodo = (event) => {
    // ページのリロードがトリガーされるのを避けるために、送信イベントのデフォルトのアクションを防止する
    event.preventDefault();

    // input要素の中身を取得
    inputText = inputElement.value;

    if(inputText === '') return;

    resetExistingTodoHtml();

    // 追加するtodoItemを生成
    const todoItem = createTodoItem(inputText);

    // 追加
    todoListArray.push(todoItem);

    // 見た目を更新
    updateListAppearance(todoListArray);
  };

  /**
   * [createTodoItem todoListArrayに追加するtodoItemを生成し、返す]
   * 
   * @param {String} inputText inputに入力したテキスト
   * @returns {Object}
   */
  const createTodoItem = (inputText) => {
    const todoItem = {}
    todoItem.key = todoId++;
    todoItem.todoText = inputText;
    todoItem.completed = false;

    return todoItem;
  }

  /**
   * [resetExistingTodHtml 既存のtodoListのhtmlを全削除する]
   */
  const resetExistingTodoHtml = () => {
    // 今ある最新の状態のtodoを取得するために再取得
    let todoItemListUl = document.querySelector('#js-todo-list-ul');
    // 一度全ての子要素を削除
    while (todoItemListUl.lastChild) {
      todoItemListUl.removeChild(todoItemListUl.lastChild);
    }
  }

  /**
   * [createCheckboxHtml checkboxのhtmlを生成し、返す]
   * 
   * @param {Object} todo これから追加するtodoオブジェクト
   * @returns {HTMLObjectElement}
   */
  const createCheckboxHtml = (todo) => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('todo-list-checkbox', 'js-todo-list-checkbox');
    checkbox.checked = todo.completed;
    checkbox.id = todo.key;

    return checkbox;
  }
  
  /**
   * [createCheckboxHtml checkboxのhtmlを生成し、返す]
   * 
   * @param {Object} todo これから追加するtodoオブジェクト
   * @param {HTMLObjectElement} checkboxHtml 生成したcheckboxのhtml
   * @returns {HTMLObjectElement}
   */
  const createLabelHtml = (todo, checkboxHtml) => {
    const label = document.createElement('label');
    label.classList.add("todo-list-label");
    label.htmlFor = todo.key;

    toggleCompletedStrike(todo, label);

    label.prepend(checkboxHtml);

    return label;
  }

  /**
   * [createButtonHtml 新しくボタンを生成する]
   * 
   * @param {Object} todo これから追加するtodoオブジェクト
   * @returns {HTMLObjectElement}
   */
  const createButtonHtml = (todo, text) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.id = todo.key;
    button.textContent = text;

    if(text === '削除'){
      button.classList.add('todo-delete-button');
      button.classList.add('js-todo-delete-button');
    }
    return button;
  }

  /**
   * [createContentEditableHtml contenteditable要素を持つdivを作成し、返す]
   * @returns {HTMLObjectElement}
   */
  const createContentEditableHtml = () => {
    const div = document.createElement('div');
    div.contentEditable = false;
    div.classList.add("todo-todo_text_wrapper");
    return div;
  }

  /**
   * [createListItem 追加するtodoItemを作成し、htmlに追加していく]
   * 
   * @param {Object} todo 描画するtodoリストアイテムのobject形式のデータ
   */
  const addList = (todo) => {
    // checkboxのhtmlを生成する
    const checkboxHtml = createCheckboxHtml(todo);

    // <li>要素を生成
    const todoItem = document.createElement('li');
    todoItem.classList.add('todo-list-li');

    // <label>要素を生成
    const labelHtml = createLabelHtml(todo, checkboxHtml);

    // <button>要素を生成
    const deleteButtonHtml = createButtonHtml(todo, '削除');
    
    todoItem.appendChild(labelHtml);
    todoItem.appendChild(deleteButtonHtml);

    // <ul>に作った要素を格納
    todoItemListUl.appendChild(todoItem);
  }

  /**
   * [toggleCompletedStrike] todoが完了していたら、横線を引く
   * 
   * @param {Object} todo これから追加するtodoオブジェクト
   * @param {HTMLObjectElement} label label要素
   */
  const toggleCompletedStrike = (todo, label) => {
    const div = createContentEditableHtml();
    div.append(todo.todoText);

    // 取り消し線をつける
    if(todo.completed === true){
      const strike = document.createElement('s');
      strike.append(div);
      label.appendChild(strike);
    }else{
      label.append(div);
    }
  }

  /**
   * [addCheckboxClickEvent チェックボックスにクリックイベントをつける]
   */
  const addCheckboxClickEvent = () => {
    const checkboxElement = document.querySelectorAll('.js-todo-list-checkbox');
    checkboxElement.forEach((checkbox, index) => {
      checkbox.addEventListener('click',(e) => {
        // true, falseの持つ情報を逆転
        todoListArray[index]['completed'] = !(todoListArray[index]['completed']);
        var labelElement = document.querySelector(`label[for='${e.target.id}']`);
        var inputElement = document.querySelector(`input[id='${e.target.id}']`);
        labelElement.textContent = '';
        toggleCompletedStrike(todoListArray[index], labelElement);
        labelElement.prepend(inputElement);
      });
    });
  }

  /**
   * [addButtonClickEvent ボタンにクリックイベントをつける]
   */
  const addButtonClickEvent = () => {
    const deleteButtonElement = document.querySelectorAll('.js-todo-delete-button');
    deleteButtonElement.forEach((button) => {
      button.addEventListener('click', (e) => {
        deleteTodo(e.target.dataset.id);
      });
    });
  }

  /**
   * 新規で追加された要素にクリックイベントをつける
   */
  const addClickEvent = () => {
    addCheckboxClickEvent();
    addButtonClickEvent();
  }

  /**
   * [deleteTodo todoListArrayから指定したtodoを削除する] 
   * @param {String} id クリックしたボタンについているid 
   */
  const deleteTodo = (id) => {
    const newtodoListArray = todoListArray.filter(todo => todo.key != id);
    todoListArray = [...newtodoListArray];
    resetExistingTodoHtml();
    updateListAppearance(todoListArray);
  }

  /**
   * [updateListAppearance todoListの見た目を更新する]
   * 
   * @param {Array} todoListArray 
   */
  const updateListAppearance = (todoListArray) => {
    // todolistを作成する
    todoListArray.forEach((todo) => {
      addList(todo);
    });

    // 追加した要素にクリックイベントをつける
    addClickEvent();

    // inputエリアを空にする
    inputElement.value = '';

    //カウント数の更新
    todoCount.textContent = todoListArray.length;
  }

  /**
   * controller
   */
  formElement.addEventListener('submit', (event) => {
    updateTodo(event);
  });
}
