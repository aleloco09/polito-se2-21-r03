import { Row, Col, Container } from "react-bootstrap";

function Footer() {
	return (
		<Container fluid>
			<Row>
				<Col className="bg-dark text-light text-center">
					&copy; Developed by team <b>SoloEquijoin</b>: <br />
					Mattia Lisciandrello, Gabriele Inzerillo, Antonio Centola, Giovanni
					Bernardo
				</Col>
			</Row>
		</Container>
	);
}

export default Footer;
