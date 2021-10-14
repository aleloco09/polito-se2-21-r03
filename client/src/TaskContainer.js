import { Container, ListGroup, Row } from "react-bootstrap";
import { useState } from "react"
import TaskRow from "./TaskRow"
import AddTask from "./AddTask"



function TaskContainer(props) {
	const filter = props.filter;
	const [modify, setModify] = useState(false);


	function renderList(param) {
		if (props.taskList && props.taskList.length>0 ) {
			return props.taskList.map((item) => (
				<TaskRow
					taskList={props.taskList}
					setTaskList={props.setTaskList}
					item={item}
					key={item.id}
					modify={modify}
					setModify={setModify}
					setDirty={props.setDirty}
					user={props.user}
				></TaskRow>
			));
		}
	}

	return (
		<Container
			fluid
			className="flex-grow-1 bg-light"
			style={{ margin: 0, paddingLeft: 0 }}
		>
			<Row inline className="justify-content-between align-items-center">
				<h1 style={{ margin: 10, marginLeft: 20 }}>
					<b>Filter:</b> {filter}
				</h1>
			</Row>
			<ListGroup variant="flush">
				{renderList(filter)}
				<Row style={{ display: 'flex', justifyContent: 'flex-end' }}>
					<AddTask
						taskList={props.taskList}
						setTaskList={props.setTaskList}
						modify={modify}
						setModify={setModify}
						setDirty={props.setDirty}
						user={props.user}
					></AddTask>
				</Row>
			</ListGroup>

		</Container>
	);
}


export default TaskContainer;