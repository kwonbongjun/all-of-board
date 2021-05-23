import {Component} from "react";
import axios from "axios";
import { Form } from 'react-bootstrap';
// import User from './User.js'

class Test2 extends Component {    
    constructor(props) {
        super(props)
        this.state = {
            message: ""
        }
        // if (! User.isUser)
        //     window.location.href="/login.html"
    }

    componentDidMount() {
        // this.getApi();
    }

    getApi = () => {
        axios.get("http://172.30.1.10:8080/all")
            .then(res => {
                console.log(res);
                this.setState({
                    message: res.data
                })
            })
            .catch(res => console.log(res))
    }
    render() {
        return(
            <div>
                Main 페이지
                <Form action="/logout" method="post">
                    <Form.Control variant="primary" type="submit" value="로그 아웃">
                    
                    </Form.Control>
                </Form>
            </div>
        )
    }
}

export default Test2