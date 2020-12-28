import { format } from 'date-fns'
import { nanoid } from 'nanoid';

class Task {
    constructor(name, description, deadline, priority) {
        this.name = name;
        this.description = description || '';

        this.deadline = deadline;

        this.priority = priority || "medium";
        this.id = nanoid();
        this.done = false;
    }

};

export { Task }