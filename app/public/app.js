
async function loadTasks(){

let res =
await fetch("/tasks");

let tasks =
await res.json();


document.getElementById("tasks")
.innerHTML =
tasks.map(t=>`

<li class="${t.completed?'done':''}">

<span onclick="toggleTask('${t._id}')">

${t.title}

</span>


<button onclick="deleteTask('${t._id}')">
X
</button>

</li>

`).join("");

}




async function addTask(){

let title =
document.getElementById("taskInput").value;


await fetch("/tasks",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
title
})

});


document.getElementById("taskInput").value="";

loadTasks();

}



async function toggleTask(id){

await fetch(`/tasks/${id}`,{
method:"PATCH"
});


loadTasks();

}




async function deleteTask(id){

await fetch(`/tasks/${id}`,{
method:"DELETE"
});


loadTasks();

}



loadTasks();

