import { App } from './app'
import { Project } from './project';
import { Task } from './task';



let app = new App();

// Check if the user has already something on the local drive
if (localStorage.getItem('projects')) {
    app.projects = JSON.parse(localStorage.getItem('projects'));
} else {
    // If not, initialize a Default Project with a Default Task
    let defaultProject = new Project('Default Project', "It's here so you know how this works.");
    app.projects.push(defaultProject);
    localStorage.setItem('projects', JSON.stringify(app.projects));
};

app.showProjects()
document.querySelector('#create-project').addEventListener('click', app.createProject)