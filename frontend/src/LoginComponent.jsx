import {Component} from "react";
import axios from "axios";
import * as Axios from './lib/Axios.ts'
import { Form } from 'react-bootstrap';
class LoginComponent extends Component {    
    constructor(props) {
        super(props)
        this.state = {
            message: "",
            id: "",
            password: ""
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
                password: this.state.password
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
            console.log(e);
        }
      }
    render() {
        return (
            <div>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Label>ID</Form.Label>
                    <Form.Control 
                        type ="text" placeholder="ID" value={this.state.id} onChange={this.handleChangeId}
                    ></Form.Control>
                    <Form.Control 
                        type ="password" placeholder="Password" value={this.state.password} onChange={this.handleChangePassword}
                    ></Form.Control>
                    <Form.Control variant="primary" type="submit" value="제출">
                    </Form.Control>
                </Form>
            </div>
        )
    }
}

export default LoginComponent