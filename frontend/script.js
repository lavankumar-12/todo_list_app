const authSection = document.getElementById('authSection');
const todoSection = document.getElementById('todoSection');
const authMsg = document.getElementById('authMsg');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');

const registerBtn = document.getElementById('registerBtn');
const loginBtn = document.getElementById('loginBtn');
const addBtn = document.getElementById('addBtn');
const logoutBtn = document.getElementById('logoutBtn');

let currentUser = null;

// ---------- Auth ----------
registerBtn.onclick = async () => {
    const res = await fetch('/api/users/register', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
            username: usernameInput.value.trim(), 
            password: passwordInput.value.trim()
        })
    });
    const text = await res.text();
    authMsg.innerText = text;
    if(res.ok) { 
        currentUser = usernameInput.value.trim();
        showTodo();
    }
}

loginBtn.onclick = async () => {
    const res = await fetch('/api/users/login', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
            username: usernameInput.value.trim(), 
            password: passwordInput.value.trim()
        })
    });
    const text = await res.text();
    authMsg.innerText = text;
    if(res.ok) { 
        currentUser = usernameInput.value.trim();
        showTodo();
    }
}

logoutBtn.onclick = async () => {
    const res = await fetch('/api/users/logout', {method:'POST'});
    if(res.ok){
        currentUser = null;
        authSection.style.display = 'block';
        todoSection.style.display = 'none';
        taskList.innerHTML = '';
        authMsg.innerText = '';
        usernameInput.value = '';
        passwordInput.value = '';
    }
}

// ---------- Show ToDo Section ----------
function showTodo() {
    authSection.style.display = 'none';
    todoSection.style.display = 'block';
    fetchTasks();
}

// ---------- Task CRUD ----------
async function fetchTasks() {
    const res = await fetch('/api/tasks');
    if(!res.ok) return alert("Could not fetch tasks");
    const tasks = await res.json();
    renderTasks(tasks);
}

function renderTasks(tasks){
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        
        const span = document.createElement('span');
        span.innerHTML = task.completed ? `<del>${task.title}</del>` : task.title;
        li.appendChild(span);

        const actions = document.createElement('div');

        // Complete/Undo Button
        const completeBtn = document.createElement('button');
        completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
        completeBtn.style.backgroundColor="green";
        completeBtn.onclick = async (e)=>{
            e.stopPropagation();
            const res = await fetch(`/api/tasks/${task.id}/complete`, {method:'PUT'});
            if(res.ok) fetchTasks();
            else alert('Could not toggle complete');
        };
        actions.appendChild(completeBtn);

        // Edit Button
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.style.backgroundColor="blue";
        editBtn.onclick = async (e)=>{
            e.stopPropagation();
            const newTitle = prompt('Edit task:', task.title);
            if(!newTitle) return;
            const res = await fetch(`/api/tasks/${task.id}`, {
                method:'PUT',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({title:newTitle})
            });
            if(res.ok) fetchTasks();
            else alert('Could not edit task');
        };
        actions.appendChild(editBtn);

        // Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.style.backgroundColor="red";
        deleteBtn.onclick = async (e)=>{
            e.stopPropagation();
            if(!confirm('Are you sure to delete this task?')) return;
            const res = await fetch(`/api/tasks/${task.id}`, {method:'DELETE'});
            if(res.ok) fetchTasks();
            else alert('Could not delete task');
        };
        actions.appendChild(deleteBtn);

        li.appendChild(actions);
        taskList.appendChild(li);
    });
}

// Add Task
addBtn.onclick = async () => {
    const title = taskInput.value.trim();
    if(!title) return alert('Please enter a task');
    const res = await fetch('/api/tasks', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({title})
    });
    if(res.ok){
        taskInput.value = '';
        fetchTasks();
    } else {
        alert('Could not add task');
    }
}
