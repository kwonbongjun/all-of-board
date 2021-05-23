import {Component} from "react";
// import axios from 'axios';
import { Form } from 'react-bootstrap';
import styled from 'styled-components';
import * as Axios from '../lib/Axios.ts'

const StyledButton = styled.button`
  /* 공통 스타일 */
  display: inline-flex;
  outline: none;
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  padding-left: 1rem;
  padding-right: 1rem;

  /* 크기 */
  height: 2.25rem;
  font-size: 1rem;

  /* 색상 */
  background: #228be6;
  &:hover {
    background: #339af0;
  }
  &:active {
    background: #1c7ed6;
  }

  /* 기타 */
  & + & {
    margin-left: 1rem;
  }
`;
function Button({ children, ...rest }) {
    return <StyledButton {...rest}>{children}</StyledButton>;
}

class SignUpComponent extends Component {
    constructor(props) {
      super(props)
      this.state = {
        id: '',
        password: ''
      }
      this.handleChangeId = this.handleChangeId.bind(this);
      this.handleChangePassword = this.handleChangePassword.bind(this);
      this.signUp = this.signUp.bind(this);
    }
    handleChangeId(event) {
      this.setState({id: event.target.value});
    }
    handleChangePassword(event) {
      this.setState({password: event.target.value});
    }
    async signUp(event) {
      event.preventDefault();
      await Axios.post('login/signUp', 
      {
        id: this.state.id,
        password: this.state.password
      });
      // await axios({
      //   method: 'post',
      //   url: 'http://localhost:8080/login/signUp',
      //   headers: {
      //     'content-type': 'application/json;charset=utf-8'
      //   },
      //   data: {
      //     id: this.state.id,
      //     password: this.state.password
      //   },
      //   withCredentials: true
      // })
    }
    render() {
      return (
        <Form>
          <Form.Label>ID</Form.Label>
          <Form.Control 
              type ="text" placeholder="ID" value={this.state.id} onChange={this.handleChangeId}
          ></Form.Control>
          <Form.Control 
              type ="password" placeholder="Password" value={this.state.password} onChange={this.handleChangePassword}
          ></Form.Control>
          <Button onClick={this.signUp}>회원가입</Button>
        </Form>
      )
    }
  }
  
export default SignUpComponent;