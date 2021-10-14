import dayjs from "dayjs"

function Task(
	id,
	description,
	isUrgent = false,
	isPrivate = true,
	deadline = ""
) {
	this.id = id;
	this.description = description;
	this.isUrgent = isUrgent;
	this.isPrivate = isPrivate;
	// saved as dayjs object
	
	if (deadline === ""){
		this.deadline = dayjs();
	}
	else {
		this.deadline = dayjs(deadline);	
	}


	this.toString = () => {
		return (
			`Id: ${this.id}, ` +
			`Description: ${this.description}, Urgent: ${this.urgent}, Private: ${this.private}, ` +
			`Deadline: ${this._formatDeadline("DD/MM/YYYY HH:mm A")}`
		);
	};

	this._formatDeadline = (format) => {
		return this.deadline.format(format);
	};
}

function TaskList() {
	this.list = [];

	this.get = () => {
		return this.list;
	};

	this.add = (task) => {
		for(const e in this.list){
			if (e.id===task.id)
				throw new Error("Duplicate id");
		}
		this.list=[...this.list,task];
		
	};

	this.sortByDeadline = () => {
		return [...this.list].sort((a, b) => {
			const t1 = a.deadline,
				t2 = b.deadline;
			if (t1 === t2) return 0;
			// works also for null === null
			else if (t1 === null || t1 === "") return 1;
			// null/empty deadline is the lower value
			else if (t2 === null || t2 === "") return -1;
			else return t1.diff(t2);
		});
	};

	this.modifyTask = (id, description, urgent, isPrivate, newDate) => {
		for (let e of this.list) {
			if (e.id === id) {
				e.description = description;
				e.isUrgent=urgent;
				e.isPrivate=isPrivate;
				e.deadline=newDate;
			}
		}
	};

	this.deleteTask=(id)=>{
		for(let e of this.list){
			if(e.id===id){
				let a=this.list.indexOf(e);
				if(a>(-1))
					this.list.splice(a,1);
				
			}
		}
	}
}

export {Task, TaskList};
