
import {Container, ListGroup } from "react-bootstrap";
import {Link} from "react-router-dom"


function Filters(props) {
	let selected=props.filter;


	return (
		<Container style={{ padding: 0 }}>
			<ListGroup variant="flush">
			<Link to={"/Filters/All"}>
				<ListGroup.Item
					onClick={() => {props.setFilter("All"); props.setSelected("All");}}
					className= {
						(selected === "All") ? "active text-light" : "bg-secondary text-light"
					}
				>
					All
				</ListGroup.Item>
				</Link>
				<Link to={"/Filters/Important"}>
				<ListGroup.Item
					onClick={() => {props.setFilter("Important"); props.setSelected("Important");}} 
					className= {
						(selected === "Important") ? "active text-light" : "bg-secondary text-light"
					}
				>
					Important
				</ListGroup.Item>
				</Link>
				<Link to={"/Filters/Today"}>
				<ListGroup.Item
					onClick={() => {props.setFilter("Today"); props.setSelected("Today");}} 
					className= {
						(selected === "Today") ? "active text-light" : "bg-secondary text-light"
					}
				>
					Today
				</ListGroup.Item>
				</Link>
				<Link to={"/Filters/Next7Days"}>
				<ListGroup.Item
					onClick={() => {props.setFilter("Next7Days"); props.setSelected("Next7Days");}} 
					className= {
						(selected === "Next7Days") ? "active text-light" : "bg-secondary text-light"
					}
				>
					Next 7 days
				</ListGroup.Item>
				</Link>
				<Link to={"/Filters/Private"}>
				<ListGroup.Item
					onClick={() => {props.setFilter("Private"); props.setSelected("Private");}} 
					className= {
						(selected === "Private") ? "active text-light" : "bg-secondary text-light"
					}
				>
					Private
				</ListGroup.Item>
				</Link>
			</ListGroup>
		</Container>
	);
}

export default Filters;
