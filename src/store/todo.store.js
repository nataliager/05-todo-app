import { Todo } from "../todos/models/todo.model";

const Filters = {
    All: 'all',
    Pending: 'pending',
    Completed: 'completed'
}

const state = {
    todos: [
        new Todo("Piedra del alma"),
        new Todo("Piedra del infinito"),
        new Todo("Piedra rosa"),
        new Todo("Piedra del poder"),
        new Todo("Piedra del tiempo"),
        new Todo("Piedra del espacio"),
    ],
    filter: Filters.All,
}

const initStore = () => {
    loadStore();
    console.log('InitStore 🥑');
}

const loadStore = () => {
    if ( !localStorage.getItem('state') ) return;
    const { todos = [], filter = Filters.All } = JSON.parse( localStorage.getItem('state') );
    state.todos = todos;
    state.filter = filter;
}

const saveStateToLocalStorage = () => {
    localStorage.setItem('state', JSON.stringify( state ) );
}
 
/**
 * Get the todos depending on the filter
 * @param {String} filter 
 * @returns {Array<Todo>}
 */
const getTodos = ( filter = Filters.All ) => {
    switch ( filter ) {
        case Filters.All:
            return [...state.todos];
        case Filters.Pending:
            return state.todos.filter( todo => !todo.done );
        case Filters.Completed:
            return state.todos.filter( todo => todo.done );
        default:
            throw new Error(`Filter ${ filter } is not valid`);   
    }
}

/**
 * Add a new todo to the store
 * @param {String} description 
 */
const addTodo = ( description ) => {
    if ( !description ) throw new Error('Description is required');
    state.todos.push( new Todo( description ) );

    saveStateToLocalStorage();
}

/**
 * Toggle the completion status of a todo
 * @param {String} id Todo id 
 */
const toggleTodo = ( id ) => {
    //with find
    const todo = state.todos.find( todo => todo.id === id );
    if ( !todo ) throw new Error(`Todo with id ${ id } not found`);
    todo.done = !todo.done;

    //with map
    // state.todos = state.todos.map( todo => {
    //     if ( todo.id === id ) {
    //         return {
    //             ...todo,
    //             done: !todo.done
    //         }
    //     }
    //     return todo;
    // });
    saveStateToLocalStorage();

}

/**
 *  Delete a todo from the store
 * @param {String} id 
 */
const deleteTodo = ( id ) => {
    state.todos = state.todos.filter( todo => todo.id !== id );
    saveStateToLocalStorage();
}

/**
 * Delete all completed todos from the store
 */
const deleteCompleted = () => {
    state.todos = state.todos.filter( todo => !todo.done );
    saveStateToLocalStorage();
}

/**
 * Set the current filter
 * @param {Filters} filter 
 */
const setFilter = ( filter = Filters.All ) => {
    if ( !Object.values(Filters).includes( filter ) ) throw new Error(`Filter ${ filter } is not valid`);
    state.filter = filter;
    saveStateToLocalStorage();
}

/**
 * Get the current filter
 * @returns {Filters} Returns the current filter
 */
const getCurrentFilter = () => {
    return state.filter;
}   

export default {
    initStore,
    loadStore,
    addTodo,
    toggleTodo,
    deleteTodo,
    deleteCompleted,
    setFilter,
    getCurrentFilter,
    getTodos,
}
