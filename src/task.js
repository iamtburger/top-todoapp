import { format } from 'date-fns'
import { nanoid } from 'nanoid';

class Task {
    constructor(name, description, deadline, priority) {
        this.name = name;
        this.description = description || '';

        if(!deadline) {
            let today = new Date();
            let todayFormatted = format(today, 'dd.MM.yyyy');
            this.deadline = todayFormatted;
        } else {
            this.deadline = deadline;
        }

        this.priority = priority || "medium";
        this.id = nanoid()
    }

};

export { Task }