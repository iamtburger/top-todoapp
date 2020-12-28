import { Project } from "./project";
import { Task } from "./task";
import { differenceInDays, format, parseISO } from "date-fns"
// import { differenceInCalendarISOYears } from 'date-fns/differenceInCalendarISOYears';

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
                        <div class="d-flex">
                            <div class="p-2 w-100 align-self-center">
                                ${project.name}
                            </div>
                            <div class="p-2 flex-shrink-1 align-self-center delete-project">
                                <i class="fas fa-trash-alt"></i>
                            </div>
                        </div>
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
        if (!deadline) {
            return alert('Deadline is necessary!')
        }
        let task = new Task(taskName, taskDescription, deadline, priority);
        selected['tasks'].push(task);

        localStorage.setItem('projects', JSON.stringify(projects));

        this.showTasks(projects, selected.id)

        document.querySelector('#task-name').value = '';
        document.querySelector('#task-description').value = '';

    }

    showTasks(projects, id) {
        this.clearSelected(projects);
        console.log(this.searchElement(projects, id))
        let index;
        if (this.searchElement(projects, id) === -1) {
            index = 0;
        } else {
            index = this.searchElement(projects, id);
        }
        // let index = this.searchElement(projects, id);
        
        projects[index]['selected'] = true;
    
        
        let targetNode = document.querySelector('#tasks');

        let renderTasks = projects[index]['tasks'].map(function(task, taskIndex) {
            
            // Rendering priorities with color-codes
            let renderedPrio;
            let priorityColor;
            let checked;
            if (task.done === true) {
                priorityColor = "card text-white bg-success strikethrough"
                checked = 'checked'
                if(task.priority === "1") {
                    renderedPrio = "High priority";
                } else if (task.priority === "2") {
                    renderedPrio = "Medium priority"
                } else if (task.priority === "3") {
                    renderedPrio = "Low priority"
                }
            } else {
                if(task.priority === "1") {
                    renderedPrio = "High priority";
                    priorityColor = "card text-white bg-danger mb-3";
                } else if (task.priority === "2") {
                    renderedPrio = "Medium priority"
                    priorityColor = "card text-dark bg-warning mb-3";
                } else if (task.priority === "3") {
                    renderedPrio = "Low priority"
                    priorityColor = "card text-white bg-secondary mb-3";
                }
            }


            // Shortening shown description
            let shownDescription;
            if (task.description.length > 40) {
                shownDescription = task.description.substring(0, 40) + '...';
                console.log(task.description.length)
            } else {
                shownDescription = task.description;
            };


            // // Remaining days
            let today = new Date()
            let todayFormatted = format(new Date(), 'yyyy-MM-dd');
            let daysLeft = differenceInDays(parseISO(task.deadline), parseISO(todayFormatted))

            // TODO: add remaining days to each task card
            return `
            <div class="col-sm-3">
                <div class="${priorityColor}" style="max-width: 20rem;" >
                    <div class="card-body" data-index="${taskIndex}">
                        <div class="d-flex">
                            <div class="p-2 w-100" data-id="${task.id}" data-bs-toggle="modal" data-bs-target="#taskModal">
                                <h5 class="card-title">${task.name}</h5>
                            </div>
                            <div class="p-2 flex-shrink-1">
                                <div class="form-check checkbox-state" data-index="${taskIndex}">
                                    <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" ${checked}>
                                </div>
                            </div>
                        </div>

                        <div data-id="${task.id}" data-bs-toggle="modal" data-bs-target="#taskModal">
                            <p class="card-text description">${shownDescription}</p>
                            <p class="card-text">${task.deadline} | ${daysLeft} days left</p>
                            <p class="card-text">${renderedPrio}</p>
                        </div>
                        <div class="mt-3 d-flex align-items-end flex-column">
                            <div class="delete p-2">
                                <i class="fas fa-trash-alt"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            ` 
        }).join('');

        let addTaskButton = `
            <div>
                <button type="button" class="btn btn-primary m-4" data-bs-toggle="modal" data-bs-target="#taskModal" data-id="new-task">
                    Add New Task
                </button>
            </div>
        `
        targetNode.innerHTML = renderTasks + addTaskButton;

        document.querySelector('#taskModal').addEventListener('show.bs.modal', (selected) => {
            let card = selected.relatedTarget;

            let taskId = card.getAttribute('data-id');
            if (taskId === 'new-task') {
                document.querySelector('#create-task').onclick = () => this.createTask(projects);
                selected.stopImmediatePropagation()
            } else {
                this.editTask(projects, taskId)
                // preventing the eventListener to stack up while changing projects
                selected.stopImmediatePropagation()
            }

        });

        // Update Task status
        document.querySelectorAll('.card-body').forEach((element, taskIndex)=> {
            element.addEventListener('change', (target)=> {
                if (projects[index]['tasks'][taskIndex].done === false) {
                    element.parentElement.classList.remove('bg-danger', 'bg-warning', 'bg-light', 'text-dark', 'text-white');
                    element.parentElement.classList.add('bg-success', 'text-white', 'strikethrough')
                    projects[index]['tasks'][taskIndex].done = true;
                } else {
                    projects[index]['tasks'][taskIndex].done = false;
                    element.parentElement.classList.remove('bg-success', 'text-white', 'strikethrough')
                    if(projects[index]['tasks'][taskIndex].priority === "1") {
                        element.parentElement.classList.add('bg-danger', 'text-white');
                    } else if (projects[index]['tasks'][taskIndex].priority === "2") {
                        element.parentElement.classList.add('bg-warning', 'text-dark');
                    } else if (projects[index]['tasks'][taskIndex].priority === "3") {
                        element.parentElement.classList.add('text-white');
                    }                    
                }

                localStorage.setItem('projects', JSON.stringify(projects));
            })
        });

        this.removeTask(projects, id);

        this.removeProject(projects);

    };

    editTask(projects, taskId) {

        document.querySelector('#create-task').removeAttribute('onclick')
        
        let selectedProject = projects.filter(project => project.selected === true)[0];
        let taskIndex = this.searchElement(selectedProject.tasks, taskId);
        let selectedTask = selectedProject['tasks'][taskIndex]
        console.log(selectedTask)

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

    removeTask(projects, projectId) {
        let projectIndex = this.searchElement(projects, projectId);
        let project = projects[projectIndex];
        document.querySelectorAll('.delete').forEach((element, taskIndex) => {
            element.addEventListener('click', () => {
                project['tasks'].splice(taskIndex, 1)
                this.showTasks(projects, projectId);
            });
        })
        localStorage.setItem('projects', JSON.stringify(projects));

    };

    removeProject(projects) {
        // TODO - I wish my was ready so I could add this there
        document.querySelectorAll('.delete-project').forEach((element, projectIndex) => {
            element.addEventListener('click', () => {
                projects.splice(projectIndex, 1)
                console.log(projects)
                this.showProjects(projects)
            })
        })
        

    };

    clearSelected(projects) {
        projects.forEach((project)=> {
            project.selected = false;
        })
    }

}

export { App }