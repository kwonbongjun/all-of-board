import {Component} from "react";
import axios from "axios";
import { InputGroup, FormControl, Modal } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import styled from 'styled-components';
import * as Board from './Board.ts'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import * as Axios from '../lib/Axios.ts'
import * as User from '../user/User.ts';
import CommentComponent from './CommentComponent'
const ComponentDiv = styled.div`
width: 100%;
text-align: left;
`;
const BottomDiv = styled.div`
text-align: center;
margin: 10px;
`;
const TextArea = styled.textarea`
width: 100%;
margin: 10px;
`;
const ItemDiv = styled.div`
margin: 10px;
`;
const ItemContentsDiv = styled.div`
min-height: 400px;
border: 1px solid;
margin: 10px;
`;
const Button = styled.button`
margin: 10px;
`;
class BoardContentsComponent extends Component {    
    constructor(props) {
        super(props);
        // this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            id: undefined,
            title: "",
            content: undefined,
            files: [],
            filesAttrs: [],
            attachedFiles: undefined,
            attachedFilesAttrs: [],
            board: {},
            listItems: [],
            commentList: [],
            comment: undefined,
            userId: undefined,
            imgModal: false,
            imgSrc: undefined,
            recommendation: 0,
            decommendation: 0,
        }
        console.log('12313');
        this.handleFiles = this.handleFiles.bind(this);
        this.handleAttachedFiles = this.handleAttachedFiles.bind(this);
        // this.saveContents = this.saveContents.bind(this);
        this.changeTitle = this.changeTitle.bind(this);
        this.changeContent = this.changeContent.bind(this);
    }
    async componentDidMount() {
        var url = new URL(window.location.href);
        var id = url.searchParams.get("id");
        this.setState({ id: id });
        const boardData = {
            id: window.location.search
        }
        await Axios.post('board/boardViewById', 
        {
            id: id,
        });
        let board = await Board.getBoard(boardData);
        function getTime(time) {
            time = time.replace('T', ' ');
            return time;
        }
        board.board.time = getTime(board.board.time);
        console.log(board);
        this.setState({
            board: board.board
        })
        this.setState({recommendation: this.state.board.recommendation});
        this.setState({decommendation: this.state.board.decommendation});
        const fileList = board.file.filter(fileItem => { if(fileItem.category === 'file') return fileItem});
        const content = document.getElementById("content");
        content.innerHTML = this.state.board.content;
        let outer = this;
        for (let i = 0; i < fileList.length; i++) {
            // const oldImg = document.querySelectorAll('img')[i]
            // oldImg.onload = function() {
            //     window.URL.revokeObjectURL(this.src);
            // }
            const list = document.querySelectorAll('img')[i].parentNode;
        
            list.removeChild(document.querySelectorAll('img')[i]);
            // content.appendChild(list);
            console.log('1',list);
            const img = document.createElement("img");

            const byteCharacters = atob(fileList[i].file);
            const byteNumbers = new Array(byteCharacters.length);
            for (let bi = 0; bi < byteCharacters.length; bi++) {
                byteNumbers[bi] = byteCharacters.charCodeAt(bi);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], {type: 'image/jpeg'});
            // let array = new Uint8Array(fileList[i].file.length);
            // for (var bi = 0; bi < fileList[i].file.length; bi++){
            //     array[bi] = fileList[i].file.charCodeAt(bi);
            // }
            // const blob = new Blob(fileList[i].file, {type: 'image/jpeg'});
           
            const file = blob;
            new File([fileList[i].file], fileList[i].name, {
                id: fileList[i].id,
                type: fileList[i].type,
                category: fileList[i].category,
                size: fileList[i].size,
            });
            
            // const fileBlob = await this.readfile(file);
            img.src = window.URL.createObjectURL(file);
            img.onclick= function() {
                let src = window.URL.createObjectURL(file);;
                outer.setState({imgModal: true, imgSrc: src});
            }
            img.height = 200;
            img.onload = function() {
              window.URL.revokeObjectURL(this.src);
            }
            list.appendChild(img);
        }

        
        const attachedFileList = board.file.filter(fileItem => { if(fileItem.category === 'attachedFile') return fileItem});
        const download = document.getElementById("download");
    
        for (let i = 0; i < attachedFileList.length; i++) {
            const byteCharacters = atob(attachedFileList[i].file);
            const byteNumbers = new Array(byteCharacters.length);
            for (let bi = 0; bi < byteCharacters.length; bi++) {
                byteNumbers[bi] = byteCharacters.charCodeAt(bi);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], {type: 'image/jpeg'});
            // let array = new Uint8Array(fileList[i].file.length);
            // for (var bi = 0; bi < fileList[i].file.length; bi++){
            //     array[bi] = fileList[i].file.charCodeAt(bi);
            // }
            // const blob = new Blob(fileList[i].file, {type: 'image/jpeg'});
           
            const file = blob;
            new File([attachedFileList[i].file], attachedFileList[i].name, {
                id: attachedFileList[i].id,
                type: attachedFileList[i].type,
                category: attachedFileList[i].category,
                size: attachedFileList[i].size,
            });
            
            // const fileBlob = await this.readfile(file);
            const url = window.URL.createObjectURL(file);
            const a = document.createElement("a");
            a.download = `${attachedFileList[i].name}`;
            a.href = url;
            a.innerText=`${attachedFileList[i].name}(${attachedFileList[i].size}byte)`;
            a.setAttribute('style', 'margin: 10px;display: inline-block');
            file.onload = function() {
                window.URL.revokeObjectURL(url);
            }
            download.appendChild(a);
        }

        // const comment = await Axios.get('board/getComment');
        // this.setState({commentList: comment});
        // this.setState({
        //     listItems: board.file.filter(fileItem => { if(fileItem.category === 'attachedFile') return fileItem}).map((file) => {
        //         return <a key={file.id + file.name} href="" download>{file.name}</a>
        //     })
        // })
        this.setState({userId: User.getUserId()});
    }
    changeTitle(event) {
        console.log(event, event.target.value);
        this.setState({title: event.target.value});
    }
    changeContent(e) {
        console.log(e.target.value);
        this.setState({title: e.target.value})
    }
    async handleAttachedFiles(e) {
        let attachedFiles = [];
        const attachedFilesAttrs = [];
        for (const file of e.target.files) {
            const fileBlob = await this.readfile(file);
            // const fileItem = Object.create(file);
            file.category = 'attachedFile'
            attachedFiles.push(file);
            attachedFilesAttrs.push( 
                {
                    category: 'attachedFile',
                    type: file.type,
                    size: file.size,
                    name: file.name,
                }
            )
        };
        this.setState({
            attachedFiles:  e.target.files,
            attachedFilesAttrs: attachedFilesAttrs
        })
        console.log(this.state.attachedFiles, e.target.files);
    }
    async handleFiles(e) {
        // await new Response(e.target.files[0]).text();
        const files = [];
        const filesAttrs = [];
        for (const file of e.target.files) {
            const fileBlob = await this.readfile(file);
            file.category = 'file';
            files.push(file);
            filesAttrs.push( 
                {
                    category: 'file',
                    type: file.type,
                    size: file.size,
                    name: file.name,
                }
            )
            console.log(e, e.target.files);
            const fileList = document.getElementById("fileList");
            if (! e.target.files.length) {
                fileList.innerHTML = "<p>No files selected!</p>";
              } else {
                  //그림은 따로 저장하고 불러올 때 img태그에 각각 매핑. <div><img></div><div><p>글</p></div>
                // fileList.innerHTML = "";
                const list = document.createElement("div");
                fileList.appendChild(list);
                // for (let i = 0; i < e.target.files.length; i++) {
                //   const li = document.createElement("li");
                //   list.appendChild(li);
            
                  const img = document.createElement("img");
                  img.src = window.URL.createObjectURL(file);
                  img.height = 200;
                  img.onload = function() {
                    window.URL.revokeObjectURL(this.src);
                  }
                //   li.appendChild(img);
                  list.appendChild(img);
                //   const info = document.createElement("span");
                //   info.innerHTML = this.state.files[i].name + ": " + this.state.files[i].size + " bytes";
                //   li.appendChild(info);
                // }
            }
        }
       


        const fileTag = document.getElementById("fileList").innerHTML;
        this.setState({
            content: fileTag
        });
        this.setState({
            files: files,
            filesAttrs: filesAttrs
        })
        console.log(this.state.files);
    }
    readfile(file) {
        var reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onloadend = function(evt) {
                // file is loaded
                const result = evt.target.result;
                // const result = new Blob([evt.target.result], { type: file.type });
                // console.log(result);
                resolve(result)
            };
            reader.onerror = reject;
            reader.readAsDataURL(file); //blob이나 파일 읽고 종료되면 readystate done이 되어 onloadend실행
        });
    }
    addComment = async (e) => {
        const text = document.querySelector("#commentText").value;
        await Axios.post('board/addComment', 
        {
            boardId:this.state.id, 
            text: text,
            author: User.getUserId() === undefined? 'anonymous': User.getUserId(),
            time: new Date(),
            recommendation: 0,
            decommendation: 0,
        });
        console.log(e, text);
        window.location.reload();
    }
    recommend = async (e) => {
        if (User.getUserId()) {
            try {
                let res = await Axios.post('board/recommend', 
                {
                    boardId:this.state.id, 
                    userId: User.getUserId(),
                    type: 'recommendation'
                });
                console.log(res.data);
                if (res.data) {
                    await Axios.post('board/boardRecommendById', 
                    {
                        id:this.state.id, 
                        recommendation: this.state.recommendation + 1,
                        decommendation: this.state.decommendation
                    });
                    this.setState({recommendation: this.state.recommendation + 1});
                } else {
                    await Axios.post('board/boardRecommendById', 
                    {
                        id:this.state.id, 
                        recommendation: this.state.recommendation - 1,
                        decommendation: this.state.decommendation
                    });
                    this.setState({recommendation: this.state.recommendation - 1});
                }
            } catch (e) {
                console.log(e);
            }
        }
    }
    decommend = async (e) => {
        if (User.getUserId()) {
            try {
                let res = await Axios.post('board/decommend', 
                {
                    boardId:this.state.id, 
                    userId: User.getUserId(),
                    type: 'decommendation'
                });
                console.log(res.data);
                if (res.data) {
                    await Axios.post('board/boardRecommendById', 
                    {
                        id:this.state.id, 
                        recommendation: this.state.recommendation,
                        decommendation: this.state.decommendation + 1
                    });
                    this.setState({decommendation: this.state.decommendation + 1});
                } else {
                    await Axios.post('board/boardRecommendById', 
                    {
                        id:this.state.id, 
                        recommendation: this.state.recommendation,
                        decommendation: this.state.decommendation - 1
                    });
                    this.setState({decommendation: this.state.decommendation - 1});
                }
            } catch (e) {
                console.log(e);
            }
        }
    }
    commentHandler = () => {
        console.log(this.state.comment);
    }
    deleteContents = async (e) => {
        console.log(this.state.id);
        await Board.deleteBoard('?id='+this.state.id);
        window.location.href = '/board';
    }
    closeDialog() {
        window.URL.revokeObjectURL(this.state.imgSrc);
        this.setState({imgModal: false})
    }
    render() {
        return (
            <ComponentDiv>
                {/* <Form>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">제목</InputGroup.Text>
                        </InputGroup.Prepend>
                        
                    </InputGroup>
                </Form> */}
                <ItemDiv>제목: { this.state.board.title }</ItemDiv>
                <ItemDiv>카테고리 : {this.state.board.category}</ItemDiv>
                <ItemDiv>작성자 : {this.state.board.author}</ItemDiv>
                <ItemDiv>시간 : {this.state.board.time}</ItemDiv>
                <ItemDiv>조회수: {this.state.board.view}</ItemDiv>
                <ItemDiv>내용</ItemDiv>
                <ItemContentsDiv id="content"></ItemContentsDiv>
                {/* <div id="fileList">
                    <p>No files selected!</p>
                </div>
                <textarea name="hide" style={{display:'none'}}></textarea> */}
                <ItemDiv>다운로드:
                <span id='download'>
                    {this.state.listItems}
                </span>
                
                <BottomDiv>
                    <Button variant="primary" type="button" onClick={this.recommend}>
                        <i className="fas fa-thumbs-up"></i>
                        추천: {this.state.recommendation}
                    </Button>
                    
                    <Button variant="primary" type="button" onClick={this.decommend}>
                        <i className="fas fa-thumbs-down"></i>
                        싫어요: {this.state.decommendation}
                    </Button>
                </BottomDiv>

                </ItemDiv>
                <ItemDiv>댓글</ItemDiv>
                <ItemDiv>
                    <CommentComponent></CommentComponent>
                </ItemDiv>
                
                <ItemDiv>댓글 작성</ItemDiv>
                <BottomDiv>
                    <Form>
                        <Form.Group controlId="exampleForm.ControlTextarea1">
                            <TextArea rows={3} id="commentText"/>
                        </Form.Group>
                        <Button variant="primary" type="button" onClick={this.addComment}>
                            Submit
                        </Button>
                    </Form>
                    
                {
                    this.state.userId === this.state.board.author &&
                    <Link to={{
                        pathname: `/board/edit`,
                        search: `?id=${this.state.id}`}}> <Button variant="primary" type="button">수정</Button>
                    </Link>
                }
                {
                    this.state.userId === this.state.board.author &&
                    <Button variant="primary" onClick={this.deleteContents} type="button">
                        삭제
                    </Button>
                }
                 
                </BottomDiv>
                <Modal show={this.state.imgModal} onHide={this.closeDialog.bind(this)}>
                    <Modal.Header closeButton>
                    <Modal.Title>이미지 확대</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                    <div>
                        <img src={this.state.imgSrc} width='400' height= '300'></img>
                    </div>
                    </Modal.Body>

                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.closeDialog.bind(this)}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </ComponentDiv>
        )
    }
}

export default BoardContentsComponent