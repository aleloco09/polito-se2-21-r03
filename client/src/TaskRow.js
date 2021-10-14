import { useState } from "react";
import {
	Form,
	Col,
	ListGroup,
	Button,
} from "react-bootstrap";
import ModalForm from "./ModalForm"
import API from "./API";



function TaskRow(props) {
	const [show, setShow] = useState(false);

	function handleDelete(id){

		const deleteTask = async (id, user) => {
			API.deleteTask(id)
			.then(()=> {
				props.setDirty(true);
			})
			.catch(function (error) {
				console.log(error);
				alert("Si è verificato un errore, riprova.");
			});
		}
		deleteTask(id);
	}

	const handleCheck= (event) => {
		event.preventDefault();
		if (props.item.completed === 0){
			API.completeTask(props.item.id, 1).then(()=> {
				props.setDirty(true);
			})
		}
		else{
			API.completeTask(props.item.id, 0).then(()=> {
				props.setDirty(true);
			})
		}

	}	
	return (
		<ListGroup.Item className="container-fluid bg-light  ">
			<Form inline>
				{props.item.completed ? (
					<Form.Check type="checkbox" checked style={{ width: "10px", height: "10px" }} onClick={handleCheck}/>
				) : (
					<Form.Check type="checkbox" style={{ width: "10px", height: "10px" }} onClick={handleCheck} />
					)}
				<Col id="leftElementList" className="align-item-centers">
					{props.item.important ? (
						<p style={{ color: "red" }} className="m-0">
							{props.item.description}
						</p>
					) : (
						props.item.description
					)}
				</Col>
				<Col id="centerElementList">
					{props.item.private ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							height="32px"
							viewBox="0 0 24 24"
							width="32px"
							fill="#000000"
						>
							<path d="M0 0h24v24H0V0z" fill="none" />
							<path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
						</svg>
					) : (
						""
					)}
				</Col>
				<Col> {props.item.deadline}</Col>
				<Col id="rightElementList" className="m-0 p-0">
					<Button
						variant="outline-dark"
						onClick={() => {setShow(true);
										props.setModify(true);
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							height="18px"
							viewBox="0 0 24 24"
							width="18px"
							fill="#000000"
						>
							<path d="M0 0h24v24H0V0z" fill="none" />
							<path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z" />
						</svg>
					</Button>

					<Button
						variant="outline-dark"
						onClick={() => {
							handleDelete(props.item.id);
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							height="18px"
							viewBox="0 0 24 24"
							width="18px"
							fill="#000000"
						>
							<path d="M0 0h24v24H0V0z" fill="none" />
							<path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z" />
						</svg>
					</Button>
				</Col>
			</Form>
			<ModalForm
					taskList={props.taskList}
					setTaskList={props.setTaskList}
					show={show}
					setShow={setShow}
					modify={props.modify}
					setModify={props.setModify}
					description={props.item.description}
					urgent={props.item.important}
					isPrivate={props.item.private}
					date={props.item.deadline}
					item={props.item}
					id={props.item.id}
					setDirty={props.setDirty}
			></ModalForm>
		</ListGroup.Item>
	);
}

export default TaskRow;
