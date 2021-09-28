import {Component} from "react";
import axios from "axios";
import * as Axios from '../lib/Axios.ts'
import { Form, Modal } from 'react-bootstrap';
import styled from 'styled-components';
import style from './login.module.css';
import s2 from './Login.module.scss';
import './Login2.scss';
import Btn from '../Button.scss';
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
  text-align: center;
`;
const FormContentsDiv = styled.div`
  margin: 15px;
`;
const NameDiv =  styled.div`
  display: inline-block;
  width: 100px;
  text-align: left;
`;
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
function Button({ children, ...rest }) {
    return <StyledButton {...rest}>{children}</StyledButton>;
}
class LoginComponent extends Component {    
    constructor(props) {
        super(props)
        this.state = {
            message: "",
            id: "",
            password: "",
            errInfo: {},
        }
        this.handleChangeId = this.handleChangeId.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
    }

    handleChangeId(event) {
        this.setState({id: event.target.value});
    }
    handleChangePassword(event) {
        this.setState({password: event.target.value});
    }
    async handleSubmit(event) {
        event.preventDefault()
        // let param = new URLSearchParams();
        // param.append('username', this.state.id);
        // param.append('password', this.state.password);
        try {
            await Axios.post('login', {
                username: this.state.id,
                password: this.state.password,
            })
            // const a = await axios({
            //     method: 'post',
            //     headers: {
            //         'content-type': 'application/json;charset=utf-8'
            //     },
            //     url: 'http://localhost:8080/login',
            //     data: {
            //             username: this.state.id,
            //             password: this.state.password
            //         },
            //     withCredentials: true
            // })
            window.location.href="/index.html"
            // User.isLoggedIn();
        } catch(e) {
            // console.log(e.response);
            this.setState({
                errInfo: {msg: e.response.data.message}
              })
            // //   this.setState({
            // //     errInfo: {msg: 'ID 혹은 Password가 틀렸습니다.'}
            // //   })
                this.setState({signUpModal:true});
        }
      }
      closeDialog() {
        this.setState({signUpModal: false})
      }
    render() {
        return (
            <SignupDiv>
                <FormDiv>
                    <Form onSubmit={this.handleSubmit}>
                        <FormContentsDiv>
                            <NameDiv>ID</NameDiv>
                            <input className={style.Input}
                                type ="text" placeholder="ID" value={this.state.id} onChange={this.handleChangeId}
                            ></input>
                        </FormContentsDiv>
                        <FormContentsDiv>
                            <NameDiv>Password</NameDiv>
                            <input className={s2.Input}
                                type ="password" placeholder="Password" value={this.state.password} onChange={this.handleChangePassword}
                            ></input>
                        </FormContentsDiv>
                        <Button type="submit" value="제출">제출
                        </Button>
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

export default LoginComponent