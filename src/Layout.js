import { Outlet } from "react-router-dom";
import './Layout.css';
import Canvas from './component/Canvas';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';

const Layout = () => {
  return (
    <div className="App">
      <Navbar bg="light" expand="lg" className="fixed-top pages-menu">
      <Container>
        <Navbar.Brand href="/">IIA</Navbar.Brand>
        <Nav>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/About">About</Nav.Link>
              <NavDropdown title="Projects" id="projects-nav-dropdown">
                <NavDropdown.Item eventKey="disabled" >2022Spring</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/Projects/Bim">BIM</NavDropdown.Item>
                <NavDropdown.Item href="/Projects/Undergraduated">Undergraduated</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Nav>
      </Container>
      </Navbar>
      <Outlet />
      <Canvas />
      <Navbar bg="light" expand="lg" className="fixed-bottom">
        <Container className="justify-content-center">©2022 IIA studio</Container>
      </Navbar>
    </div>
  );
}

export default Layout;
