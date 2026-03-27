import html from './app.html?raw';
import todoStore from '../store/todo.store';
import { renderTodos } from './use-cases';


const elementIds = {
    todoList: '.todo-list',
    newTodoInput: '#new-todo-input',
    clearCompletedButton: '.clear-completed',
    toggleAllLabel: 'label[for="toggle-all"]',
    todoFilters: '.filtro',
    pendingCountLabel: '#pending-count'
}

/**
 * 
 * @param {String} elementId 
 */
export const App = ( elementId ) => {

    const displayTodos = () => {
        const todos = todoStore.getTodos( todoStore.getCurrentFilter() );
        renderTodos( elementIds.todoList, todos );

        const pendingCount = todoStore.getTodos( 'pending' ).length;
        document.querySelector( elementIds.pendingCountLabel ).innerText = pendingCount;
    }

    //Cuando la funcion App se ejecute, se va a ejecutar la función anónima que se encuentra dentro de ella, esto es para evitar que el código se ejecute antes de tiempo, es decir, antes de que el DOM esté listo.
    ( () => {
        const app = document.createElement('div');
        app.innerHTML = html;
        document.querySelector( elementId ).append( app );
        displayTodos();
    })();


    //Referencias a elementos del DOM
    const newDescriptionInput = document.querySelector( elementIds.newTodoInput );
    const todoListUL = document.querySelector( elementIds.todoList );
    const clearCompletedButton = document.querySelector( elementIds.clearCompletedButton );
    const toggleAllLabel = document.querySelector( elementIds.toggleAllLabel );
    const filtersUL = document.querySelectorAll( elementIds.todoFilters );

    //Listeners
    newDescriptionInput.addEventListener('keyup', ( event ) => {

        if( event.keyCode !== 13 ) return;
        if( event.target.value.trim().length === 0 ) return;

        todoStore.addTodo( event.target.value );
        event.target.value = '';
        displayTodos();
    });

    todoListUL.addEventListener('click', ( event ) => {
        const element = event.target.closest('[data-id]');
        const id = element.getAttribute('data-id');
        todoStore.toggleTodo( id );
        displayTodos();
    })

    //Eliminar un todo
    todoListUL.addEventListener('click', ( event ) => {
        if( !event.target.classList.contains('destroy') ) return;
        const element = event.target.closest('[data-id]');
        const id = element.getAttribute('data-id');
        todoStore.deleteTodo( id );
        displayTodos();
    });

    //Borrar todos los completados
    clearCompletedButton.addEventListener('click', () => {
        todoStore.deleteCompleted();
        displayTodos();
    });
    

    //Ocultar/mostrar la lista
    toggleAllLabel.addEventListener('click', ( event ) => {
        event.preventDefault();
        todoListUL.classList.toggle('hidden');
    });

    //Cambiar el filtro
    filtersUL.forEach( element => {
        element.addEventListener('click', ( event ) => {
            event.preventDefault();
            filtersUL.forEach( el => el.classList.remove('selected') );
            event.target.classList.add('selected');
            const filter = event.target.getAttribute('data-filter');
            todoStore.setFilter( filter );
            displayTodos();
        });
    });
}
