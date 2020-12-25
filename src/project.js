import { nanoid } from 'nanoid'

class Project {
    constructor(name, description) {
        this.name = name;
        this.description = description || '';
        this.tasks = [];
        // This is a temporary id generator -> TODO implement a valid ID generator
        this.id = nanoid()
        this.selected = false;
    };

}

export { Project }