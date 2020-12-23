import { Project } from "./project";
import { Task } from "./task";

class App {
    constructor() {
        // this.projects = projects;
        this.createProject = this.createProject.bind(this);
    };

    // Search for the index of a Project or a Task
    searchElement(arr, id) {
        let index = arr.map(e => e.id).indexOf(id);
        return index;
    };

    // Remove a Project or a Task based on ID
    removeElement (arr, elementId) {
        let index = this.searchElement(arr, elementId)
        arr.splice(index, 1)
    };


    // Project related actions

    // Creating a new Project
    createProject(p) {
            const projectName = document.querySelector('#project-name').value;
            const projectDesc = document.querySelector('#project-description').value;
            let project = new Project(projectName, projectDesc);
            // console.log(project)
            p.push(project)
            localStorage.setItem('projects', JSON.stringify(p));
            this.showProjects(p)

            // Clearing Modal fields
            document.querySelector('#project-name').value = '';
            document.querySelector('#project-description').value = '';
    }

    // Rendering the projects
    showProjects(p) {
        let targetNode = document.querySelector('#projects');
    
        let renderProjects = p.map(function(project, index) {
                return `
                    <li data-id="${project.id}" class="project-name">
                        <p>${project.name}</p>
                    </li>
                `
            }).join('');
    
        targetNode.innerHTML = renderProjects;
        document.querySelectorAll('.project-name').forEach(select => select.addEventListener('click', ()=>this.showTasks(p, select.dataset.id)))
    };

    // this.showTasks(p, select.dataset.id)
    showTasks(p, id) {
        let index = this.searchElement(p, id)
        let targetNode = document.querySelector('#tasks');

        let renderTasks = p[index]['tasks'].map(function(task, index) {
            return `
                <div data-id="${task.id}" class"task">
                    <p>${task.name}</p>
                </div>
            ` 
        }).join('');

        let addTaskButton = `
            <div>
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#taskModal">
                    Add New Task
                </button>
            </div>
        `

        targetNode.innerHTML = renderTasks + addTaskButton;
        document.querySelector('#create-task').addEventListener('click', ()=> {
            const taskName = document.querySelector('#task-name').value;
            const taskDesc = document.querySelector('#task-description').value;
            let task = new Task(taskName, taskDesc);

            p[index]['tasks'].push(task);
            localStorage.setItem('projects', JSON.stringify(p));

            // Clearing Modal fields
            document.querySelector('#task-name').value = '';
            document.querySelector('#task-description').value = '';

            this.showTasks(p, id)
        })

        // console.log(p)
    
    };

}



export { App }