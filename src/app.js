import { Project } from "./project";

class App {
    constructor() {
        // this.projects = projects;
        this.createProject = this.createProject.bind(this);
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
    createProject(p) {
            const projectName = document.querySelector('#project-name').value;
            const projectDesc = document.querySelector('#project-description').value;
            let project = new Project(projectName, projectDesc);
            console.log(project)
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
                    <li data-id="${project.id}">
                        <p>${project.name}</p>
                    </li>
                `
            }).join('');
    
        targetNode.innerHTML = renderProjects;
    };


}



export { App }