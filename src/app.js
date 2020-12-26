import { Project } from "./project";
import { Task } from "./task";

class App {
    constructor() {
        this.createProject = this.createProject.bind(this);
        this.createTask = this.createTask.bind(this);
    };

    searchElement(arr, id) {
        let index = arr.map(e => e.id).indexOf(id);
        return index;
    };

    removeElement (arr, elementId) {
        let index = this.searchElement(arr, elementId)
        arr.splice(index, 1)
    };


    // Project related actions

    createProject(projects) {
            const projectName = document.querySelector('#project-name').value;
            const projectDesc = document.querySelector('#project-description').value;
            let project = new Project(projectName, projectDesc);
            projects.push(project)
            localStorage.setItem('projects', JSON.stringify(projects));
            this.showProjects(projects)

            document.querySelector('#project-name').value = '';
            document.querySelector('#project-description').value = '';
    }

    showProjects(projects) {
        let targetNode = document.querySelector('#projects');
    
        let renderProjects = projects.map(function(project, index) {
                return `
                    <li data-id="${project.id}" class="project-name">
                        <p>${project.name}</p>
                    </li>
                `
            }).join('');
    
        targetNode.innerHTML = renderProjects;
        document.querySelectorAll('.project-name').forEach(select => select.addEventListener('click', ()=>this.showTasks(projects, select.dataset.id)))
    };

    createTask(projects) {
        let selected = projects.filter(project => project.selected === true)[0]

        let taskName = document.querySelector('#task-name').value;
        let taskDescription = document.querySelector('#task-description').value;
        let deadline = document.querySelector('#calendar').value;
        let priority = document.querySelector('#task-priority').value;
        let task = new Task(taskName, taskDescription, deadline, priority);
        selected['tasks'].push(task);

        localStorage.setItem('projects', JSON.stringify(projects));

        this.showTasks(projects, selected.id)

        document.querySelector('#task-name').value = '';
        document.querySelector('#task-description').value = '';

    }

    showTasks(projects, id) {
        this.clearSelected(projects);
        let index = this.searchElement(projects, id);
        projects[index]['selected'] = true;
        let targetNode = document.querySelector('#tasks');

        let renderTasks = projects[index]['tasks'].map(function(task, index) {
            
            // Rendering priorities with color-codes
            let renderedPrio;
            let priorityColor;
            if(task.priority === "1") {
                renderedPrio = "High priority";
                priorityColor = "card text-white bg-danger mb-3";
            } else if (task.priority === "2") {
                renderedPrio = "Medium priority"
                priorityColor = "card text-dark bg-warning mb-3";
            } else if (task.priority === "3") {
                renderedPrio = "Low priority"
                priorityColor = "card text-dark bg-light mb-3";
            }

            // Shortening shown description
            let shownDescription;
            if (task.description.length > 40) {
                shownDescription = task.description.substring(0, 40) + '...';
                console.log(task.description.length)
            } else {
                shownDescription = task.description;
            }
            

            // TODO: add remaining days to each task card
            return `
            <div class="col-sm-3">
                <div class="${priorityColor}" data-id="${task.id}" style="max-width: 20rem;" data-bs-toggle="modal" data-bs-target="#taskModal">
                    <div class="card-body">
                        <h5 class="card-title">${task.name}</h5>
                        <p class="card-text">${shownDescription}</p>
                        <p class="card-text">${task.deadline}</p>
                        <p class="card-text">${renderedPrio}</p>
                    </div>
                </div>
            </div>
            ` 
        }).join('');

        let addTaskButton = `
            <div>
                <button type="button" class="btn btn-primary m-4" data-bs-toggle="modal" data-bs-target="#taskModal">
                    Add New Task
                </button>
            </div>
        `

        let testButton = `
            <div>
                <button type="button" class="btn btn-primary m-4" data-bs-toggle="modal" data-bs-target="#taskModal">
                TEsting modal
                </button>
            </div>
        `

        targetNode.innerHTML = renderTasks + addTaskButton;

        // document.querySelectorAll('.card').forEach(selected => selected.onclick = () => this.editTask(projects, selected.dataset.id))
        // prevent eventlistener from stacking up! -> Search solution without onclick.
        document.querySelector('#taskModal').addEventListener('show.bs.modal', (selected) => {
            let card = selected.relatedTarget;
            let taskId = card.getAttribute('data-id');
            this.editTask(projects, taskId)
            // selected.stopImmediatePropagation()

        });

        // Preventing the event from firing multiple times - as they were stacked due to showTasks and createTasks being called by each other - instead of addEventListener it was necessary to use .onclick eventHandler.
        document.querySelector('#create-task').onclick = () => this.createTask(projects);
    
    };

    editTask(projects, taskId) {
        console.log('1')

        document.querySelector('#create-task').removeAttribute('onclick')
        
        let selectedProject = projects.filter(project => project.selected === true)[0];
        let taskIndex = this.searchElement(selectedProject.tasks, taskId);
        let selectedTask = selectedProject['tasks'][taskIndex]

        document.querySelector('#task-name').value = selectedTask.name;
        document.querySelector('#task-description').value = selectedTask.description;
        document.querySelector('#calendar').value = selectedTask.deadline;
        document.querySelector('#task-priority').value = selectedTask.priority;
        document.querySelector('#create-task').textContent = "Save Changes";
        document.querySelector('#taskModalLabel').textContent = selectedTask.name;

        document.querySelector('#create-task').onclick = () => {
            selectedTask.name = document.querySelector('#task-name').value;
            selectedTask.description = document.querySelector('#task-description').value;
            selectedTask.deadline = document.querySelector('#calendar').value;
            selectedTask.priority = document.querySelector('#task-priority').value;

            localStorage.setItem('projects', JSON.stringify(projects));

            this.showTasks(projects, selectedProject.id);
        };
    };

    removeTask() {
        // TODO - I wish my was ready so I could add this there
    };

    removeProject() {
        // TODO - I wish my was ready so I could add this there
    };

    clearSelected(projects) {
        projects.forEach((project)=> {
            project.selected = false;
        })
    }

}

export { App }