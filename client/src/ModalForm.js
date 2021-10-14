import { Button, Modal, Form, Col} from "react-bootstrap";
import { useState } from "react";
import dayjs from "dayjs";
import { Formik} from "formik";
import API from "./API"


function ModalForm(props) {
	const [description, setDescription] = useState(props.description);
	const [urgent, setUrgent] = useState(props.urgent);
	const [isPrivate, setPrivate] = useState(props.isPrivate);
	const [date, setDate] = useState(dayjs(props.date)); //dayjs
	let user = props.user;	

	if(date===undefined)
		setDate(dayjs())
	if(urgent===undefined)
		setUrgent(false)
	if(isPrivate===undefined)
		setPrivate(false)

	const handleClose=()=>{
		props.setShow(false);
		setDescription(description);
		setPrivate(isPrivate);
		setUrgent(urgent);
		setDate(date);
		user={}
		props.setModify(false)

	}
        
    const handleModify = (event) => {
		event.preventDefault();
		
		const updateTask = async (id, description, isPrivate, deadline, urgent) => {
			API.updateTask(id, description, isPrivate, deadline, urgent, user)
			.then(()=> {
				props.setDirty(true);
				handleClose();
			})
			.catch(function (error) {
				console.log(error);
				alert("Si è verificato un errore, riprova.");
			});
			
		}

		updateTask(props.id, description, isPrivate, date, urgent);
	};

	const addTask = async (description,urgent,isPrivate,deadline,user) => {
		API.addTask(description,urgent,isPrivate,deadline,user)
		.then(() => {
			props.setDirty(true);
			handleClose();
			setDescription("");
			setPrivate(0);
			setUrgent(0);
			setDate(dayjs());
		})
		.catch(function (error) {
			console.log(error);
			alert("Si è verificato un errore, riprova.");
		});
	};
	

	
	const handleSubmit = (event) => {
		event.preventDefault();

		addTask(description,urgent,isPrivate,date,user.id);
	};
    if(props.modify===false) //durante l'aggiunta
		return (
			<>
				<Modal show={props.show} onHide={handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>
							{props.modify ? <p>Modify a task</p> : <p>Add a task</p>}
						</Modal.Title>
					</Modal.Header>
					<Modal.Body style={{ textAlign: "center" }}>
						<Formik
							initialValues={{
								description: "",
							}}
						>
							{({ errors, touched, isValidating }) => (
								<Form
									onSubmit={(values) => {
										if (props.modify === true) {
											handleModify(values);
										} else {
											handleSubmit(values); // same shape as initial values
										}
									}}
								>
									<Form.Group>
										<Form.Label>Insert a description</Form.Label>
										<Form.Control
											name="description"
											required
											value={description}
											placeholder="Walk around"
											type="text"
											onChange={(ev) =>
												setDescription(ev.target.value)
											}
										/>
										{errors.description && touched.description && (
											<div>{errors.description}</div>
										)}
									</Form.Group>
									<Form.Row>
										<Form.Group as={Col} md="6">
											<Form.Check
												inline
												checked={isPrivate}
												label="Private"
												name="isPrivate"
												type="checkbox"
												value={isPrivate}
												onChange={(ev) => setPrivate(ev.target.checked)}
											/>{" "}
										</Form.Group>
										<Form.Group as={Col} md="6">
											<Form.Check
												inline
												checked={urgent}
												label="Urgent"
												name="Urgent"
												type="checkbox"
												value={urgent}
												onChange={(ev) => setUrgent(ev.target.checked)}
											/>{" "}
										</Form.Group>
									</Form.Row>
									<Form.Group>
										{" "}
										<Form.Label>
											Insert date
										</Form.Label>
										<Form.Control
											name="date"
											type="datetime-local"
											value={dayjs(date).format("YYYY-MM-DDTHH:mm")}
											required
											onChange={(ev) => {
												setDate(dayjs(ev.target.value));
											}}
										/>
									</Form.Group>
									<Modal.Footer className="justify-content-center ">
										<Button variant="secondary" onClick={handleClose}>
											Close
										</Button>
										<Button variant="primary" type="onSubmit">
											Save Changes
										</Button>
									</Modal.Footer>
								</Form>
							)}
						</Formik>
					</Modal.Body>
				</Modal>
			</>
		);
	else
	return (
		<>
			<Modal show={props.show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>
						{props.modify ? <p>Modify a task</p> : <p>Add a task</p>}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body style={{ textAlign: "center" }}>
					<Formik
						initialValues={{
							description: "",
						}}
					>
						{({ errors, touched, isValidating }) => (
							<Form
								onSubmit={(values) => {
									if (props.modify === true) {
										handleModify(values);
									} else {
										handleSubmit(values); // same shape as initial values
									}
								}}
							>
								<Form.Group>
									<Form.Label>Insert a description</Form.Label>
									<Form.Control
										name="description"
										required
										value={description}
										placeholder={description}
										type="text"
										onChange={(ev) =>
											setDescription(ev.target.value)
										}
									/>
									{errors.description && touched.description && (
										<div>{errors.description}</div>
									)}
								</Form.Group>
								<Form.Row>
									<Form.Group as={Col} md="6">
										<Form.Check
											inline
											checked={isPrivate}
											label="Private"
											name="isPrivate"
											type="checkbox"
											value={isPrivate}
											onChange={(ev) => setPrivate(ev.target.checked)}
										/>{" "}
									</Form.Group>
									<Form.Group as={Col} md="6">
										<Form.Check
											inline
											checked={urgent}
											label="Urgent"
											name="Urgent"
											type="checkbox"
											value={urgent}
											onChange={(ev) => setUrgent(ev.target.checked)}
										/>{" "}
									</Form.Group>
								</Form.Row>
								<Form.Group>
									{" "}
									<Form.Label>
										Insert date
									</Form.Label>
									<Form.Control
										name="date"
										type="datetime-local"
										value={dayjs(date).format("YYYY-MM-DDTHH:mm")}
										required
										onChange={(ev) => {
											setDate(dayjs(ev.target.value));
										}}
									/>
								</Form.Group>
								<Modal.Footer className="justify-content-center ">
									<Button variant="secondary" onClick={handleClose}>
										Close
									</Button>
									<Button variant="primary" type="onSubmit">
										Save Changes
									</Button>
								</Modal.Footer>
							</Form>
						)}
					</Formik>
				</Modal.Body>
			</Modal>
		</>
	);
}

export default ModalForm;
