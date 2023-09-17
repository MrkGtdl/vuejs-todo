<!--
A fully spec-compliant TodoMVC implementation
https://todomvc.com/
-->

<script setup>
import { ref, computed, watchEffect } from 'vue'
import { useDateFormat, useNow } from '@vueuse/core';

const formattedDate = useDateFormat(useNow(),"hh:mm A");
const formatted = useDateFormat(useNow(), 'hh:mm:ss A')


const STORAGE_KEY = 'vue-todomvc'

const filters = {
  all: (todos) => todos,
  active: (todos) => todos.filter((todo) => !todo.completed),
  completed: (todos) => todos.filter((todo) => todo.completed)
}

// state
const todos = ref(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))
const visibility = ref('all')
const editedTodo = ref()

// derived state
const filteredTodos = computed(() => filters[visibility.value](todos.value))
const remaining = computed(() => filters.active(todos.value).length)

// handle routing
window.addEventListener('hashchange', onHashChange)
onHashChange()

// persist state
watchEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value))
})

function toggleAll(e) {
  todos.value.forEach((todo) => (todo.completed = e.target.checked))
}

function addTodo(e) {
  const value = e.target.value.trim()
  if (value) {
    todos.value.push({
      id: Date.now(),
      title: value,
	  time: formattedDate.value,
      completed: false
    })
    e.target.value = ''
  }
}

function removeTodo(todo) {
  todos.value.splice(todos.value.indexOf(todo), 1)
}

let beforeEditCache = ''
function editTodo(todo) {
  beforeEditCache = todo.title
  editedTodo.value = todo
}

function cancelEdit(todo) {
  editedTodo.value = null
  todo.title = beforeEditCache
}

function doneEdit(todo) {
  if (editedTodo.value) {
    editedTodo.value = null
    todo.title = todo.title.trim()
    if (!todo.title) removeTodo(todo)
  }
}

function removeCompleted() {
  todos.value = filters.active(todos.value)
}

function onHashChange() {
  const route = window.location.hash.replace(/#\/?/, '')
  if (filters[route]) {
    visibility.value = route
  } else {
    window.location.hash = ''
    visibility.value = 'all'
  }
}
</script>

<template>
  <section class="todoapp">
	
    <header class="header">
      <a href="#"><h1>TODO</h1></a>
	  <font-awesome-icon :icon="['far', 'rectangle-list']" />
	 <div class="time">
		 <h3><strong>Time:  </strong>{{ formatted }}</h3>
	 </div>
      <input
        class="new-todo"
        autofocus
        placeholder="Task for today..."
        @keyup.enter="addTodo"
      >
    </header>

    <section class="section" v-show="todos.length">
      <span class="todo-count">
        <strong>Total:{{ remaining }}</strong>
        <!-- <span>{{ remaining === 1 ? ' item' : ' items' }} left</span> -->
      </span>
      <ul class="filters">
        <li>
          <a href="#/all" :class="{ selected: visibility === 'all' }">All</a>
        </li>
        <li>
          <a href="#/active" :class="{ selected: visibility === 'active' }">In Progress</a>
        </li>
        <li>
          <a href="#/completed" :class="{ selected: visibility === 'completed' }">Done</a>
        </li>
      </ul>
      <button class="clear-completed" @click="removeCompleted" v-show="todos.length > remaining">
        Clear completed
      </button>
    </section>

    <!-- <section class="main" v-show="todos.length">
      <input
        id="toggle-all"
        class="toggle-all"
        type="checkbox"
        :checked="remaining === 0"
        @change="toggleAll"
      >
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <li
          v-for="todo in filteredTodos"
          class="todo"
          :key="todo.id"
          :class="{ completed: todo.completed, editing: todo === editedTodo }"
        >
          <div class="view">
            <input class="toggle" type="checkbox" v-model="todo.completed">
            <label @dblclick="editTodo(todo)">{{ todo.title }} - {{ todo.time }}</label>
            <button class="destroy" @click="removeTodo(todo)"></button>
          </div>
          <input
            v-if="todo === editedTodo"
            class="edit"
            type="text"
            v-model="todo.title"
            @vue:mounted="({ el }) => el.focus()"
            @blur="doneEdit(todo)"
            @keyup.enter="doneEdit(todo)"
            @keyup.escape="cancelEdit(todo)"
          >
        </li>
      </ul>
    </section> -->

	<section class="main" v-show="todos.length">
		<input
        id="toggle-all"
        class="toggle-all"
        type="checkbox"
        :checked="remaining === 0"
        @change="toggleAll"
      >
      <label for="toggle-all">Mark all as complete</label>
		<table>
			<tr>
				<th></th>
				<th>Task</th>
				<th>Time started</th>
				<th>Action</th>
			</tr>
			<tr
			v-for="todo in filteredTodos"
          	class="todo"
          	:key="todo.id"
          	:class="{ completed: todo.completed, editing: todo === editedTodo }"
			>
				<td><input class="toggle" type="checkbox" v-model="todo.completed"></td>
				<td>{{ todo.title }}</td>
				<td>{{ todo.time }}</td>
				<td><button class="destroy" @click="removeTodo(todo)"><font-awesome-icon :icon="['fas', 'trash']" style="color: #ae1e2c;" /></button></td>
			</tr>
		</table>
	</section>



  </section>
</template>

