import { Project } from "./project";

class App {
    constructor() {
        this.projects = [];
    };

    // Search for the index of a Project or a Task
    searchElement(arr, id) {
        let index = arr.map(e => e.id).indexOf(id)
        return index;
    };

    // Remove a Project or a Task based on ID
    removeElement (arr, elementId) {
        let index = this.searchElement(arr, elementId)
        arr.splice(index, 1)
    };

    // Project related actions

    // Creating a new Project
    createProject() {
            const projectName = document.querySelector('#project-name').value;
            const projectDesc = document.querySelector('#project-description').value;
            let project = new Project(projectName, projectDesc);
            this.projects.push(project)
            // TODO re-render the projects
    }

    // Rendering the projects
    showProjects() {
        let targetNode = document.querySelector('#projects');
    
        let renderProjects = this.projects.map(function(project, index) {
                return `
                    <li data-id="${project.id}">
                        <p>${project.name}</p>
                    </li>
                `
            }).join('');
    
        targetNode.innerHTML = renderProjects;
    };

}



export { App }