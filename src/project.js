class Project {
    constructor(name, description) {
        this.name = name;
        this.description = description || '';
        this.tasks = [];
        // This is a temporary id generator -> TODO implement a valid ID generator
        this.id = 1000
    };

    // addTask(task) {
    //     this.tasks.push(task);
    // };

    // removeTask(id) {
    //     let index = tasks.map(e => e.id).indexOf(id)
    //     this.tasks.splice(index, 1)
    // }
}

export { Project }