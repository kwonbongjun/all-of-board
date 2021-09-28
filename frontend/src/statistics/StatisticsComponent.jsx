import {Component} from "react";
import axios from "axios";
import { Button } from 'react-bootstrap';
import { Form, Modal } from 'react-bootstrap';
import * as User from '../user/User.ts';
import * as Board from '../board/Board.ts'
import { Bar } from 'react-chartjs-2';

class StatisticsComponent extends Component {    
    constructor(props) {
        super(props);
        this.state = {
            id: User.getUserId(),
            role: User.getUserRole(),
            show: true,
            chartData: [],
        }
        if (this.state.id === undefined) {
            // window.location.href = "/";
        }

        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
    }
    async componentDidMount() {
        if (this.state.id) {
            const rowData = await Board.getBoardListGroupByCategory();
            console.log(rowData);
            const data = {
                labels: [rowData[0].category],
                datasets: [
                  {
                    label: '# of Votes',
                    data: [rowData[0].cnt],
                    backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(255, 159, 64, 0.2)',
                    ],
                    borderColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)',
                    ],
                    borderWidth: 1,
                  },
                ],
              };
            this.setState({chartData: data});
        }
        // 왜 메인보다 이 컴포넌트가 더 빨리 실행될까?
        User.isLoggedIn().then(res => {
            this.setState({
              id: User.getUserId(),
            });
          })
    }
    handleClose() {
        this.setState({show: false});
        window.location.href = "/";
    }
    handleShow() {
        this.setState({show: true});
    }
    render() {
        const options = {
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
          };
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
                    <Bar data={this.state.chartData} options={options} />
                }
            </div>
        )
    }
}

export default StatisticsComponent