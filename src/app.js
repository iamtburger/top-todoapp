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
                <div class="${priorityColor}" data-id="${task.id}" style="max-width: 20rem;">
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

        targetNode.innerHTML = renderTasks + addTaskButton;

        // Preventing the event from firing multiple times - as they were stacked due to showTasks and createTasks being called by each other - instead of addEventListener it was necessary to use .onclick eventHandler.
        document.querySelector('#create-task').onclick = () => this.createTask(projects);
    
    };

    editTask(selectedProject, taskId) {
        
        console.log(selectedProject)
        console.log(taskId)

        let modalContent = `
        <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="editModalLabel">Edit Task</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body input-group">
                    <div class="input-group mb-3">
                        <span class="input-group-text" id="basic-addon1">Task name</span>
                        <input type="text" class="form-control" aria-label="Task name" aria-describedby="basic-addon1" id="task-name">
                    </div>
                    <div class="input-group">
                        <span class="input-group-text">Description</span>
                        <textarea class="form-control" aria-label="Description" id="task-description"></textarea>
                    </div>
                    <input class="form-control" type="date" name="" id="calendar">
                    <select class="form-select" aria-label="Priority" id="task-priority">
                        <option value="1">High priority</option>
                        <option value="2">Medium priority</option>
                        <option value="3">Low priority</option>
                      </select>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="create-task" data-bs-dismiss="modal">Add Task</button>
                </div>
            </div>
        </div>
        </div>
        `
        document.querySelector('#modal-target').innerHTML = modalContent;
        document.querySelector('#task-name').value = selectedProject.name;
        document.querySelector('#task-description').value = selectedProject.description;

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