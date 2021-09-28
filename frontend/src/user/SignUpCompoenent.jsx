import {Component} from "react";
// import axios from 'axios';
import { Form, Modal } from 'react-bootstrap';
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
  padding-top: 5px;

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
const Input = styled.input`
  width: 100px;
`;
const SignupDiv = styled.div`
// position: absolute;
  width: 100%;
  height: 100%;
`;
const FormDiv = styled.div`
  position: absolute;
  top: 20%;
  left: 42%;
  width: 300px;
  height: 500px;
  // vertical-align: middle;
  margin: 30px auto;
`;
const FormContentsDiv = styled.div`
  margin: 15px;
`;
const NameDiv =  styled.div`
  display: inline-block;
  width: 100px;
  text-align: left;
`;

function Button({ children, ...rest }) {
    return <StyledButton {...rest}>{children}</StyledButton>;
}
function SignUpModal(props) {
  const signUpModal = props.signUpModal;
  if (signUpModal) {
      return <Modal.Dialog>
      <Modal.Header closeButton>
        <Modal.Title>Modal title</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>Modal body text goes here.</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary">Close</Button>
        <Button variant="primary">Save changes</Button>
      </Modal.Footer>
    </Modal.Dialog>
  } else return ;
}
class SignUpComponent extends Component {
    constructor(props) {
      super(props)
      this.state = {
        id: '',
        password: '',
        signUpModal: false,
        errInfo: {},
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
      try {
        const a = await Axios.post('login/signUp', 
        {
          id: this.state.id,
          password: this.state.password
        });
        window.location.href="/index.html"
      } catch(e) {
        console.log(e.response.data.message);
        this.setState({
          errInfo: {msg: e.response.data.message}
        })
          this.setState({signUpModal:true});
      }
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
    closeDialog() {
      this.setState({signUpModal: false})
    }
    render() {
      return (
        <SignupDiv>
          <FormDiv>
            <h4>회원가입</h4>
            <Form>
              <FormContentsDiv>
                <NameDiv>ID</NameDiv>
                <Input
                    type ="text" placeholder="ID" value={this.state.id} onChange={this.handleChangeId}
                ></Input>
              </FormContentsDiv>
              <FormContentsDiv>
                <NameDiv>Password</NameDiv>
                <Input 
                    type ="password" placeholder="Password" value={this.state.password} onChange={this.handleChangePassword}
                ></Input>
              </FormContentsDiv>
              <Button onClick={this.signUp}>가입</Button>
            </Form>
          </FormDiv>
          
          <Modal show={this.state.signUpModal} onHide={this.closeDialog.bind(this)}>
            <Modal.Header closeButton>
              <Modal.Title>오류</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <p>{this.state.errInfo.msg}</p>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={this.closeDialog.bind(this)}>Close</Button>
            </Modal.Footer>
          </Modal>
        </SignupDiv>
      )
    }
  }
  
export default SignUpComponent;