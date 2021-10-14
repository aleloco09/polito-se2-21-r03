import { Button} from "react-bootstrap"
import { useState } from "react"
import ModalForm from "./ModalForm"


function AddTask(props) {
		const [show, setShow] = useState(false);
	return (
		<>
			<Button
				onClick={()=>
					{setShow(true)
				props.setModify(false);}}
				variant="dark"
				size="sm"
				className="mt-3 ml-2 mr-3 float-right"
				style={{float: 'right'}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					fill="currentColor"
					class="bi bi-plus-circle"
					viewBox="0 0 16 16"
				>
					<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
					<path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
				</svg>{" "}
				Add a task
			</Button>

			<ModalForm
				taskList={props.taskList}
				setTaskList={props.setTaskList}
				show={show}
				modify={props.modify}
				setShow={setShow}
				setModify={props.setModify}
				setDirty={props.setDirty}
				user = {props.user}
			></ModalForm>
		</>
	);

}

export default AddTask;
