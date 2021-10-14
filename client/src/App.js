import "./style.css";
import Navigation from "./Navigation.js";
import Footer from "./Footer.js";
import TaskContainer from "./TaskContainer.js";
import Filters from "./Filters.js";
import { Container, Col} from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom"
import Login from "./Login.js"
import { useState, useEffect } from "react";
import API from "./API";

function App() {

	const [filter, setFilter] = useState("All");
	const [selected, setSelected] = useState("All");
	const [taskList, setTaskList] = useState([]); //state relativo alle righe della lista 
	//const [userInfo,setUserinfo]=useState();
	const [user, setUser] = useState({});
	const [dirty, setDirty] = useState(true);
	const [loggedIn, setLoggedIn] = useState(false)

	const doLogIn = async (credentials) => {
		try {
			const userInfo = await API.login(credentials);
			if (filter === 0) { };
			setLoggedIn(true);
			setDirty(true);
			setUser(userInfo);
			alert(`Welcome, ${userInfo.name}!`);
		} catch (err) {
			alert(err);
		}
	}

	const doLogOut = async () => {
		await API.logout();
		setLoggedIn(false);
		// clean up everything
		setFilter("All");
		setTaskList([])
		setUser({})
	}


	useEffect(() => {  //useEffect è un hook che permette di usare i lyfecycle del component. Equivale alla componentDidMount, componentDidUpdate, componentWillUnmount.
		
		const getFilteredTasks = async (filter,userId) => {
			const tasks = await API.getFilteredTasks(filter,userId);
			setTaskList(tasks);
		};
		if ((dirty && loggedIn) || loggedIn ){
			
			getFilteredTasks(filter, user.id).then(() =>{
				setDirty(false);
			});
		}
	}, [dirty, user, loggedIn, filter]);
	return (
		<Router>
			<Switch>
				<Route path="/Filters/:filter" render={({ match }) =>
					loggedIn ? (
						<div>

							<Navigation logout={doLogOut} filter={match.params.filter} taskList={taskList} setFilter={setFilter} setSelected={setSelected} selected={selected}>

							</Navigation>
							<Container
								fluid
								className="d-flex min-vh-100"
								style={{ marginLeft: 0, marginRight: 0, padding: 0 }}
							>

								<Col
									sm={3}
									className="bg-secondary d-none d-md-block"
									style={{ padding: 0 }}
									id="sidebar"
								>
									<Filters filter={match.params.filter} taskList={taskList} setFilter={setFilter} setSelected={setSelected} selected={selected}></Filters>
								</Col>
								<Col
									className="flex-grow-1 bg-light"
									style={{ paddingLeft: 10, paddingRight: 5 }}
								>
									{/*Passo i task creati come props al componenente che genererà la lista*/}
									{(<TaskContainer
										taskList={taskList}
										setTaskList={setTaskList}
										filter={match.params.filter}
										setDirty={setDirty}
										user={user}
									></TaskContainer>)}
								</Col>
							</Container>
							<Footer></Footer>
						</div>
					) : <Redirect to="/login" />}>

				</Route>
				<Route path="/login" render={() =>
					<>{loggedIn ? <Redirect to="/Filters/All" /> : <Login login={doLogIn} />}</>
				} />
				<Route path="/" render={() =>
					<>
						{loggedIn ? (<Redirect path="/" to="/Filters/All"></Redirect>) : <Redirect path="/" to="/login"></Redirect>}
					</>
				} />
			</Switch>
		</Router>
	);
}

export default App;
