class Task {
    constructor(name, description,deadline, priority) {
        this.name = name;
        this.description = description || '';
        this.deadline = deadline;
        this.priority = priority || 0;
    }

};

export { Task }