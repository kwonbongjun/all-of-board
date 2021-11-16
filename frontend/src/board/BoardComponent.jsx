import {Component} from "react";
import axios from "axios";
import { Button } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import styled from 'styled-components';
import * as Board from './Board.ts'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import BoardEditComponent from './BoardEditComponent.jsx';
const rowData = [
    {make: "Toyota", model: "Celica", price: 35000},
    {make: "Ford", model: "Mondeo", price: 32000},
    {make: "Porsche", model: "Boxter", price: 72000}
];
const StyledBoardDiv = styled.div`
    width: 100%;
    height: 100%;
    position: absoluite;
`;
const StyledBoardHeaderDiv = styled.div`
    position: relative;
    width: 100%;
    height: 10%;
`;
const StyledGridDiv = styled.div`
    position: relative;
    width: 100%;
    height: 80%;
    text-align: left;
`;
const StyledBoardFooterDiv = styled.div`
    position: relative;
    width: 100%;
    height: 10%;
    display: flex;
`;
const StyledBoardFooterLeft = styled.div`
    flex-basis: 90%;
`;
const StyledBoardFooterRight = styled.div`
    flex-basis: 10%;
`;
const StyledNewBoardButton = styled(Button)`
    margin-top: 10px;
    padding: 0px;
    >a {
        padding: 10px;
        color: white;
        text-decoration: none;
        // display: ${props => props.user ? "inline" : "block"};
        width: 100%;
        height: 100%;
      }
`;
function BoardDiv({children, ...props}) {
    return <StyledBoardDiv {...props}>{children}</StyledBoardDiv>
}
function BoardHeaderDiv({children, ...props}) {
    return <StyledBoardHeaderDiv {...props}>{children}</StyledBoardHeaderDiv>
}
function GridDIv({children, ...props}) {
    return <StyledGridDiv {...props}>{children}</StyledGridDiv>
}
function BoardFooterDiv({children, ...props}) {
    return <StyledBoardFooterDiv {...props}>{children}</StyledBoardFooterDiv>
}
function BoardFooterLeft({children, ...props}) {
    return <StyledBoardFooterLeft {...props}>{children}</StyledBoardFooterLeft>
}
function BoardFooterRight({children, ...props}) {
    return <StyledBoardFooterRight {...props}>{children}</StyledBoardFooterRight>
}
function NewBoardButton({children, ...props}) {
    return <StyledNewBoardButton {...props}>{children}</StyledNewBoardButton>
}
class BoardComponent extends Component {    
    constructor(props) {
        super(props);
        this.state = {
            rowData: undefined,
            columnDefs: [
                {
                    headerName: 'ID',
                    field: 'id',
                    hide: true
                },
                {
                    headerName: '카테고리',
                    field: 'category'
                },
                {
                    headerName: '제목',
                    field: 'title',
                    cellRendererFramework: (params) => {
                        console.log(params.data.id);
                        return <Link to={{
                            pathname: `/board/contents`,
                            search: `?id=${params.data.id}`}}> { params.value } </Link>
                    },
                },
                {
                    headerName: '작성자',
                    field: 'author'
                },
                {
                    headerName: '조회수',
                    field: 'view'
                },
                {
                    headerName: '작성일자',
                    field: 'time'
                },
                {
                    headerName: '추천',
                    field: 'recommendation'
                },
                {
                    headerName: '비추천',
                    field: 'decommendation'
                },
            ],
        }
        this.onGridReady = this.onGridReady.bind(this);
        this.createBoard = this.createBoard.bind(this);
        this.selectPage = this.selectPage.bind(this);
        const outer = this;
    }
    async onGridReady(params) {
        let rowDataList = await Board.getBoardList();
        function getTime(time) {
            time = time.replace('T', ' ');
            return time;
        }
        let rowData = rowDataList.map(item => {
            return {
                id: item.id,
                category: item.category,
                title: item.title,
                author: item.author,
                view: item.view,
                time: getTime(item.time),//new Date(item.time),
                recommendation: item.recommendation,
                decommendation: item.decommendation
            }
        });
        console.log(rowData);
        this.setState({
            gridApi: params.api,
            columnApi: params.columnApi,
            rowData: rowData
        });
    }
    createBoard() {
        console.log('1');
    }
    selectPage(e) {
        console.log('1', e);
    }
    render() {
        return (
            <BoardDiv>
                <BoardHeaderDiv></BoardHeaderDiv>
                <GridDIv className="ag-theme-alpine">
                    <AgGridReact
                        rowData={this.state.rowData}
                        columnDefs={this.state.columnDefs}
                        onGridReady={this.onGridReady}
                        pagination={true}
                        paginationPageSize={10}
                    >
                        {/* <AgGridColumn field="make"></AgGridColumn>
                        <AgGridColumn field="model"></AgGridColumn>
                        <AgGridColumn field="price"></AgGridColumn> */}
                    </AgGridReact>
                </GridDIv>
                <BoardFooterDiv>
                    <BoardFooterLeft></BoardFooterLeft>
                    <BoardFooterRight>
                        <NewBoardButton onClick={this.createBoard} variant="primary"><Link to='/board/edit'>새 글</Link></NewBoardButton>
                    </BoardFooterRight>
                </BoardFooterDiv>
            </BoardDiv>
        )
    }
}

export default BoardComponent