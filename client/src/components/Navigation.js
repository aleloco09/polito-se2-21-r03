import { Navbar } from 'react-bootstrap/';
import { useHistory } from 'react-router';

const Navigation = (props) => {

  const history = useHistory();

  return (
    <Navbar variant="dark" fixed="top">
      <Navbar.Toggle aria-controls="left-sidebar" />
      <Navbar.Brand href="/" style={{ color: '#0a2540' }}>
        Office Queue Manager
      </Navbar.Brand>
    </Navbar>
  )
}

export default Navigation;