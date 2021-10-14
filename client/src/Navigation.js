import {Navbar, ListGroup, Row, Form, FormControl, Container, Button} from "react-bootstrap"
import { Link } from "react-router-dom"

function Navigation (props) {
    let selected=props.filter;


    return (
        <div>
            <Navbar collapseOnSelect className = "p-2" expand="md" bg="dark" variant="dark" >
 
                <Container fluid className = "justify-content-between align-items-center m-0">

                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                    <Navbar.Brand>
                            <Row className = "align-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-journal-check" viewBox="0 0 16 16" className = "ml-2">
                                <path fill-rule="evenodd" d="M10.854 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 8.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                                <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
                                <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>
                            </svg>
                            <h2 className = "m-1">ToDoManager</h2> 
                            </Row>
                    </Navbar.Brand>

                    
                    <Form inline className = "d-none d-md-block">
                        <FormControl type = "text" placeholder = "Search" className = "m-md-auto my-2"/>
                    </Form>
                    

                    <div className = "mr-1">
                    <Button variant="light" onClick={props.logout} >Logout</Button> {"    "}
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" class="bi bi-person-circle" viewBox="0 0 16 16">
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                        </svg>
                    </div>
                </Container>
                
                <Container fluid className = "d-md-none m-0">
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Form>
                            <FormControl type = "text" placeholder = "Search" className = "m-md-auto my-2"/>
                        </Form>
                        <ListGroup variant = "flush">
                        <Link to={"/Filters/All"}>
                            <ListGroup.Item //className="bg-secondary text-light"
                            onClick={() => {props.setFilter("All"); props.setSelected("All");}}
                            className= {
                                (selected === "All") ? "active text-light" : "bg-secondary text-light"
                            }>
                                All
                            </ListGroup.Item>
                            </Link>
                            <Link to={"/Filters/Important"}>
                            <ListGroup.Item //className="bg-dark text-light"
                            onClick={() => {props.setFilter("Important"); props.setSelected("Important");}} 
                            className= {
                                (selected === "Important") ? "active text-light" : "bg-secondary text-light"
                            }
                            >
                                Important
                            </ListGroup.Item>
                            </Link>
                            <Link to={"/Filters/Today"}>
                            <ListGroup.Item //className="bg-dark text-light"
                            onClick={() => {props.setFilter("Today"); props.setSelected("Today");}} 
                            className= {
                                (selected === "Today") ? "active text-light" : "bg-secondary text-light"
                            }
                            >
                                Today
                            </ListGroup.Item>
                            </Link>
                            <Link to={"/Filters/Next7Days"}>
                            <ListGroup.Item //className="bg-dark text-light"
                            onClick={() => {props.setFilter("Next7Days"); props.setSelected("Next7Days");}} 
                            className= {
                                (selected === "Next7Days") ? "active text-light" : "bg-secondary text-light"
                            }
                            >
                                Next 7 days
                            </ListGroup.Item>
                            </Link>
                            <Link to={"/Filters/Private"}>
                            <ListGroup.Item //className="bg-dark text-light"
                            onClick={() => {props.setFilter("Private"); props.setSelected("Private");}} 
                            className= {
                                (selected === "Private") ? "active text-light" : "bg-secondary text-light"
                            }
                            >
                                Private
                            </ListGroup.Item>
                            </Link>
                        </ListGroup>
                    </Navbar.Collapse>
                </Container>
                
            </Navbar>
        </div>
    );
}

export default Navigation;