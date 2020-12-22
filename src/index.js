import { App } from './app'
import { Project } from './project';
import { Task } from './task';

let projects = [];

let app = new App();

// Check if the user has already something on the local drive
if (localStorage.getItem('projects')) {
    console.log(projects)
    projects = JSON.parse(localStorage.getItem('projects'));
} 
else {
    // If not, initialize a Default Project with a Default Task
    let defaultProject = new Project('Default Project', "It's here so you know how this works.");
    projects.push(defaultProject);
    localStorage.setItem('projects', JSON.stringify(projects));
};

app.showProjects(projects)
// Using ()=> in eventListener allows you to add arguments to the function without firing on page load!
document.querySelector('#create-project').addEventListener('click', ()=> app.createProject(projects))