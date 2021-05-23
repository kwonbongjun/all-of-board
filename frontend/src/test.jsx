import {Component} from "react";
import axios from "axios";
import { Button } from 'react-bootstrap';
import { Form, Modal } from 'react-bootstrap';
import * as User from './user/User.ts';

class TestComponent extends Component {    
    constructor(props) {
        super(props);
        this.state = {
            id: User.getUserId(),
            role: User.getUserRole(),
            show: true,
        }
        if (this.state.id === undefined) {
            // window.location.href = "/";
        }

        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
    }
    handleClose() {
        this.setState({show: false});
        window.location.href = "/";
    }
    handleShow() {
        this.setState({show: true});
    }
    render() {
        return (
            <div>
                {
                    this.state.id === undefined && 
                    <Modal show={this.state.show} onHide={this.handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>권한 없음</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <p>로그인 후 이용해주세요.</p>
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleClose}>Close</Button>
                            {/* <Button variant="primary" onClick={this.handleShow}>Save changes</Button> */}
                        </Modal.Footer>
                    </Modal>
                }
                {
                    this.state.id !== undefined && 
                    <p>test Page</p>
                }
            </div>
        )
    }
}

export default TestComponent