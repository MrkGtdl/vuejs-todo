<script setup>
import { ref, onMounted, computed, watch } from 'vue'

const todos = ref([])
const name = ref('')

const content = ref('')
const category = ref(null)

const todos_asc = computed(() => todos.value.sort((a,b) =>{
	return a.createdAt - b.createdAt
}))

watch(name, (newVal) => {
	localStorage.setItem('name', newVal)
})

watch(todos, (newVal) => {
	localStorage.setItem('todos', JSON.stringify(newVal))
}, {
	deep: true
})

const addTodo = () => {
	if (content.value.trim() === '' || category.value === null) {
		return
	}

	todos.value.push({
		content: content.value,
		category: category.value,
		done: false,
		editable: false,
		createdAt: new Date().getTime()
	})
}

const removeTodo = (todo) => {
	todos.value = todos.value.filter((t) => t !== todo)
}

onMounted(() => {
	name.value = localStorage.getItem('name') || ''
	todos.value = JSON.parse(localStorage.getItem('todos')) || []
})
</script>

<template>
	<main class="app">
		
		<section class="greeting">
			<h2 class="title">
				Good Day, <input type="text" id="name" placeholder="Name here" v-model="name">
			</h2>
		</section>

    <div>
      <section class="create-todo">
			<form id="new-todo-form" @submit.prevent="addTodo">
				<h4>Create task</h4>
				<input 
					type="text" 
					name="content" 
					id="content" 
					placeholder="Task for today"
					v-model="content" />
				
				<h4>Priority type</h4>
				<div class="options">

					<label>
						<input 
							type="radio" 
							name="category" 
							id="category1" 
							value="business"
							v-model="category" />
						<span class="bubble business"></span>
						<div>low</div>
					</label>

					<label>
						<input 
							type="radio" 
							name="category" 
							id="category2" 
							value="personal"
							v-model="category" />
						<span class="bubble personal"></span>
						<div>Medium</div>
					</label>

          <label>
						<input 
							type="radio" 
							name="category" 
							id="category3" 
							value="high"
							v-model="category" />
						<span class="bubble high"></span>
						<div>High</div>
					</label>
          

				</div>

				<input type="submit" value="Add todo" />
			</form>
		</section>

		<section class="todo-list">
			<h4>TODO LIST</h4>
			<div class="list" id="todo-list">
				<div v-for="todo in todos_asc" :class="`todo-item ${todo.done && 'done'}`">
					<label>
						<input type="checkbox" v-model="todo.done" />
						<span :class="`bubble ${
							todo.category == 'business' ? 'business' : ((todo.category == 'personal') ? 'personal' : 'high')
						}`"></span>
					</label>
					<div class="todo-content">
						<input type="text" v-model="todo.content" />
					</div>

					<div class="actions">
						<button class="delete" @click="removeTodo(todo)"><fa icon="trash"/></button>
					</div>
				</div>
			</div>
		</section>
    </div>

	<div class="container">
		
	</div>

	</main>
</template>