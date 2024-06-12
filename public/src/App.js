document.querySelectorAll('.js-todo-list-checkbox').forEach(function(checkbox){
  const id = checkbox['dataset'].id;
  checkbox.addEventListener('change', async function(event) {
  const isChecked = event.target.checked === true ? 1 : 0 ;
  await fetch(`/update/${id}`, {
      method: 'POST',
      body: new URLSearchParams({
        checked : JSON.stringify(isChecked),
      })
    });
  });
});
