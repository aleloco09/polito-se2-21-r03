import { Button,Form,Alert} from "react-bootstrap";
import { useState } from "react";
import { Formik} from "formik";
import {Container, Row} from "react-bootstrap";


function Login(props) {
	const [emailNoCase, setEmail] = useState("");
    const [password, setPassword] = useState("");   
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = (event) => {
		event.preventDefault();
        setErrorMessage('');

		let email = emailNoCase.toLowerCase();
        const credentials = {email, password};
        let valid = true;
        if(email === '' || password === '' || password.length < 6)
            valid = false;
        
        if(valid)
        {
          props.login(credentials);
        }
        else {
          setErrorMessage('Password should be at least 6 characters.');
        }
	};


	return (
		<>
            <Container fluid className="flex-grow-1 p-3 bg-light min-vh-100" >
                <Row className="p-3 justify-content-md-center">
                    <h1>Hi, please login in ToDoManager!</h1>
                </Row>
                {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}    
                <hr></hr>
                
			<Formik
				initialValues={{
					description: "",
				}}
				>
				{({ errors, touched, isValidating }) => (
					<Form
					    onSubmit={(values) => {
                                    handleLogin(values);
								}}
							>
                                <Row md={2} className="p-3 justify-content-md-center">
								<Form.Group>
									<Form.Label>Insert your email</Form.Label>
									<Form.Control
										name="email"
										required
										value={emailNoCase}
										placeholder="sXXXXXX@studenti.polito.it"
										type="email"
										onChange={(ev) =>
											setEmail(ev.target.value)
										}
									/>
									{errors.description && touched.description && (
										<div>{errors.description}</div>
									)}
								</Form.Group>
                                </Row>
                                <Row md={2} className="p-3 justify-content-md-center">
								<Form.Group>
                                <Form.Label>Insert your password: it should be at least 6 characters.</Form.Label>
									<Form.Control
										name="password"
										required
										value={password}
										placeholder="*********"
										type="password"
										onChange={(ev) =>
											setPassword(ev.target.value)
										}
									/>
									{errors.description && touched.description && (
										<div>{errors.description}</div>
									)}
								</Form.Group>
                                </Row>
                                <Row lg={3} className="m-3 justify-content-md-center">
                                <Button  variant="primary" type="onSubmit">
										Login
								</Button>
                                </Row>
                                {" "}
                                {/* 
                                <Row lg={6} className="m-3 justify-content-md-center">
                                <Button variant="primary" href="/Filters/All">
										Return to homepage
								</Button>
                                </Row>
                                */}
							</Form>
						)}
				</Formik>
                <Row className="p-2 justify-content-md-center" >
                <h1>To generate the hash of a password,
                    <br/><a href="https://www.browserling.com/tools/bcrypt">this website</a> is heavily suggested</h1>
                </Row>
                </Container>
		</>
	);
}

export default Login;
