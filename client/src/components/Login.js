import React, { Component } from "react";
import { Form, FormGroup, FormControl, Button, Alert } from 'react-bootstrap';
import './login.css';

class Login extends Component {

  constructor(props) {
    super(props)

    this.state = {
      formData: {}, // Contains login form data
      errors: {}, // Contains login field errors
      loading: false, // Indicates in progress state of login form
      loginError: false
    }
  }

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    let { formData } = this.state;
    formData[name] = value;

    this.setState({
      formData: formData
    });
  }

  isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  validateLoginForm = (e) => {
    let errors = {};
    const { formData } = this.state;

    if (formData.username.length === 0) {
      errors.username = "Username can't be empty";
    }

    if (formData.password.length === 0) {
      errors.password = "Password can't be empty";
    }

    if (this.isEmpty(errors)) {
      return true;
    } else {
      return errors;
    }
  }

  login = async (e) => {
    e.preventDefault();
    const { formData } = this.state;
    let errors = this.validateLoginForm();

    if (errors !== true) {
      this.setState({
        errors: errors,
      });
      return;
    }

    try {
      const data = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      })
      const response = await data.json();
      if (response.status === 'success') {
        // window.location.href = '/';
        this.props.history.push('/');
      } else {
        this.setState({
          loginError: true,
        })
      }
    } catch (error) {
      console.log(error);
      this.setState({
        loginError: true
      })
    }
  }

  render() {
    const { errors, loginError } = this.state;

    return (
      <div className="Login">
        <Form onSubmit={this.login}>
          <FormGroup controlId="username">
            <Form.Label>Username</Form.Label>
            <FormControl type="text" name="username" placeholder="Enter your username" onChange={this.handleInputChange} />
            {errors.username &&
              <Alert variant="danger" className="mt-3">{errors.username}</Alert>
            }
          </FormGroup>
          <FormGroup controlId="password">
            <Form.Label>Password</Form.Label>
            <FormControl type="password" name="password" placeholder="Enter your password" onChange={this.handleInputChange} />
            {errors.password &&
              <Alert variant="danger" className="mt-3">{errors.password}</Alert>
            }
          </FormGroup>
          {loginError &&
            <Alert variant="danger" className="mt-3">An error occurred during login</Alert>
          }
          <Button type="submit" variant="success">Login</Button>
        </Form>
      </div>
    )
  }
}

export default Login;