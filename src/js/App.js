const $alert = document.querySelector('.alert');
const $form = document.querySelector('.grocery-form');
const $list = document.querySelector('.grocery-list');
const $btnSubmit = document.querySelector('.submit-btn');
const $grocery = document.querySelector('#grocery');
const $template = document.querySelector('.template-item').content;
const $fragment = document.createDocumentFragment();

let groceryList = [];

const INITIAL_ITEM = {
    id: "",
    value: "",
}

let editElement;
let editFlag = false;
let editID;

/* <--------------- Events ---------------> */
$grocery.addEventListener("keyup", validationForm);
$grocery.addEventListener("change", validationForm);

$form.addEventListener('submit', e => {
    e.preventDefault();
    if($btnSubmit.value !== "submit") return;
    addItem();
});

document.addEventListener('click', e => {
    if(e.target.matches('.edit') || e.target.matches('.edit > i')){
        editItem(e);
    } else if(e.target.matches('.delete') || e.target.matches('.delete > i')){
        deleteItem(e);
    } else if(e.target.matches('.clear-btn')){
        clearItems();
    }
})

/* <--------------- Functions ---------------> */

function addItem(){
    const value = $grocery.value;
    const id = new Date().getTime().toString();

    if(value !== "" && !editFlag){
        // almacenando todos los items en un arreglo
        let newItem = {...INITIAL_ITEM, id, value}
        groceryList.push(newItem);

        // creando nuevo item en el DOM
        $template.querySelector('.title').textContent = newItem.value;
        $template.querySelector('article').id = id;

        /* Le asiganos el valor de item a los botones para luego poder llamar ese id para Editlo */
        $template.querySelector('.delete').dataset.id = id;
        $template.querySelector('.delete > i').dataset.id = id;

        $template.querySelector('.edit').dataset.id = id;
        $template.querySelector('.edit > i').dataset.id = id;
        $template.querySelector('.edit').dataset.name = value;
        $template.querySelector('.edit > i').dataset.name = value;

        let $clone = document.importNode($template, true);
        $fragment.appendChild($clone);
        $list.appendChild($fragment);
        $grocery.value = "";
        $btnSubmit.disabled = true;
    }
}

function editItem(e){
    let $actual = document.getElementById(e.target.dataset.id);
    let encontrado = groceryList.find(item => item.id === $actual.id);
    $btnSubmit.value = "Edit";
    $grocery.value = e.target.dataset.name;
    
    $form.addEventListener('submit', () => {
        if($btnSubmit.value === "Edit"){
            encontrado.value = $grocery.value;
            
            $actual.querySelector('.title').textContent = $grocery.value;
            $btnSubmit.value = "submit";
            $btnSubmit.disabled = true;
            $grocery.value = "";
            $actual = null;
            encontrado = null;
            console.log(groceryList);
        }
    })
}

function deleteItem(e){
    let isDelete = confirm('Are you sure you want to remove this item?');
    if(isDelete){
        
        [...groceryList].forEach((item, index) => {
            if(item.id === e.target.dataset.id){
                groceryList.splice(index, 1);
            }
        });

        let $actual = document.getElementById(e.target.dataset.id);
        $list.removeChild($actual);
        console.log(groceryList);
    }
}

function validationForm(){
    let { grocery } = $form;
    if(!grocery.value || grocery.value === ""){
        $btnSubmit.disabled = true;
    } else {
        $btnSubmit.disabled = false;
    }
}

function clearItems(){
    let confirmacion = confirm('Are you sure you want to delete ALL the list?');
    if(confirmacion){
        groceryList = [];
        while($list.hasChildNodes()){
            $list.removeChild($list.firstChild);
        }
    }
}