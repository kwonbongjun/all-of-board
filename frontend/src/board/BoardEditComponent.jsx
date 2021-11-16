import {Component} from "react";
import axios from "axios";
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { Form, Dropdown } from 'react-bootstrap';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import styled from 'styled-components';
import * as Board from './Board.ts'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import * as Axios from '../lib/Axios.ts'
import * as User from '../user/User.ts';
const categoryList = [
    '자유'
]
const ComponentDiv = styled.div`
width: 100%;
text-align: left;
`;
const BottomDiv = styled.div`
text-align: center;
`;
const TextArea = styled.textarea`
width: 100%;
`;
const ItemDiv = styled.div`
margin: 10px;
`;
const ItemContentsDiv = styled.div`
min-height: 400px;
border: 1px solid;
margin: 10px;
`;
const ItemDropdown = styled(Dropdown)`
display: inline-block;
`;
const ItemInputGroup = styled(InputGroup)`
display: inline-block;
width: 5%;
`;
const ItemFormControl = styled(Form.Control)`
display: inline-block;
width: 80%;
`;
class BoardEditComponent extends Component {    
    constructor(props) {
        super(props);
        // this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            title: "",
            content: undefined,
            files: [],
            filesAttrs: [],
            attachedFiles: [],
            attachedFilesAttrs: [],
            edit: false,
        }
        
        this.handleFiles = this.handleFiles.bind(this);
        this.handleAttachedFiles = this.handleAttachedFiles.bind(this);
        // this.saveContents = this.saveContents.bind(this);
        this.changeTitle = this.changeTitle.bind(this);
        this.changeContent = this.changeContent.bind(this);

    }
    async componentDidMount() {
        const boardData = {
            id: window.location.search
        }
        const board = await Board.getBoard(boardData);
        console.log(board);
        
        if (board.board.id !== undefined) {
            const fileList = board.file.filter(fileItem => { if(fileItem.category === 'file') return fileItem});
            const content = document.getElementById("fileList");
            content.innerHTML = board.board.content;
            const fileFormList = [];
            for (let i = 0; i < fileList.length; i++) {
                
                console.log(document.querySelectorAll('img'), i);
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
                fileFormList.push(new File([file], fileList[i].name, {
                    id: fileList[i].id,
                    type: fileList[i].type,
                    category: fileList[i].category,
                    size: fileList[i].size,
                }));
                
                // const fileBlob = await this.readfile(file);
                img.src = window.URL.createObjectURL(file);
                console.log('2',img.src);
                img.height = 200;
                img.onload = function() {
                  window.URL.revokeObjectURL(img.src);
                }
                list.appendChild(img);
            }
    
            
            const attachedFileList = board.file.filter(fileItem => { if(fileItem.category === 'attachedFile') return fileItem});
            const download = document.getElementById("download");
            const attachedFileFormList = [];
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
                attachedFileFormList.push(new File([file], attachedFileList[i].name, {
                    id: attachedFileList[i].id,
                    type: attachedFileList[i].type,
                    category: attachedFileList[i].category,
                    size: attachedFileList[i].size,
                }));
                // const fileBlob = await this.readfile(file);
                const url = window.URL.createObjectURL(file);
                const a = document.createElement("a");
                a.download = `${attachedFileList[i].name}.jpg`;
                a.href = url;
                a.innerText=`${attachedFileList[i].name}.jpg`;
                file.onload = function() {
                    window.URL.revokeObjectURL(url);
                }
                // download.appendChild(a);
            }
            this.setState({
                board: board.board,
                edit: true,
                title: board.board.title,
                files: fileFormList,
                filesAttrs: board.file.filter(file => file.category === 'file').map(file => {
                    return {
                        category: 'file',
                        type: file.type,
                        size: file.size,
                        name: file.name,
                    }
                }),
                attachedFiles: attachedFileFormList,
                attachedFilesAttrs: board.file.filter(file => file.category === 'attachedFile').map(file => {
                    return {
                        category: 'attachedFile',
                        type: file.type,
                        size: file.size,
                        name: file.name,
                    }
                }),
                category: board.board.category,

            })
        } else {

            const fileList = document.getElementById("fileList");
            const list = document.createElement("div");
            list.setAttribute('style','min-height: 1rem; height:auto')
            fileList.appendChild(list);
        }
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
        let attachedFiles = this.state.attachedFiles;
        const attachedFilesAttrs = this.state.attachedFilesAttrs;
        for (const file of e.target.files) {
            const fileBlob = await this.readfile(file);
            if (! attachedFilesAttrs.find(item => item.name === file.name)) {
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
            }
        };
        this.setState({
            attachedFiles:  attachedFiles,
            attachedFilesAttrs: attachedFilesAttrs
        })
        console.log(this.state.attachedFiles, e.target.files);
    }
    async handleFiles(e) {
        // await new Response(e.target.files[0]).text();
        const files = this.state.files;
        const filesAttrs = this.state.filesAttrs;
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
                console.log(result);
                resolve(result)
            };
            reader.onerror = reject;
            reader.readAsDataURL(file); //blob이나 파일 읽고 종료되면 readystate done이 되어 onloadend실행
        });
    }
    saveContents = async (e) => {
        e.preventDefault();
        const fileTag = document.getElementById("fileList").innerHTML;
        await this.setState({
            content: fileTag
        });
        const data = {
            title: this.state.title,
            content: this.state.content,
            author: User.getUserId(),
            view: 0,
            time: new Date(),
            recommendation: 0,
            decommendation: 0,
            comment: 0,
            files: this.state.files,
            attachedFiles: this.state.attachedFiles,
            category: this.state.category,
        }
        console.log(this.state.content);
        console.log(fileTag);
        try {
            const formData = new FormData();
            formData.append('title', this.state.title);
            formData.append('content',this.state.content);
            formData.append('author',User.getUserId()===undefined?'anonymous':User.getUserId());
            // formData.append('view',0);
            formData.append('time',new Date());
            // formData.append('recommendation',0);
            // formData.append('decommendation',0);
            formData.append('comment',0);
            formData.append('category',this.state.category)
            formData.append('filesAttrs', JSON.stringify(this.state.filesAttrs))
            formData.append('attachedFilesAttrs', JSON.stringify(this.state.attachedFilesAttrs));
            for(let i = 0; i < this.state.files.length; i++){
                formData.append("files", this.state.files[i]);
            }
            for(let i = 0; i < this.state.attachedFiles.length; i++){
                formData.append("attachedFiles", this.state.attachedFiles[i]);
            }
            // formData.append('files',this.state.files);
            // formData.append('attachedFiles',this.state.attachedFiles);
            console.log(this.state.files, this.state.filesAttrs);
            if (this.state.edit) {
                console.log('formData',formData)
                formData.append('id', this.state.board.id);
                await Axios.postWithFiles('board/editBoard', data, formData);
                window.location.href='/board/contents?id='+this.state.board.id;
            } else {
                await Axios.postWithFiles('board/addBoard', data, formData);
                window.location.href = '/board';
            }
        } catch(e) {
            console.log(e);
        }
        
        
    }
    cancelContents = async (e) => {
        e.preventDefault();
        window.history.back();
    }
    selectCategory = (category) => {
        console.log(category);
        this.setState({category: category});
    }
    deleteAttachedFile = async (e, i) => {
        console.log(e, i);
        if (User.getUserId() === this.state.board.author) {
            try {
                this.setState({attachedFiles: this.state.attachedFiles.filter(function(comment,idx) { 
                    return idx !== i
                }),
                attachedFilesAttrs: this.state.attachedFilesAttrs.filter(function(comment,idx) { 
                    return idx !== i
                }),
                });
            } catch (e) {
                console.log(e);
            }
        }
    }
    render() {
        const categoryRender = categoryList.map(category => {
            return <Dropdown.Item key={category} onClick={() => this.selectCategory(category)}>{category}</Dropdown.Item>
            }
        );
        return (
            <ComponentDiv>
                <Form>
                    <ItemDiv>
                        카테고리:
                        <ItemDropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                {this.state.category}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {categoryRender}
                            </Dropdown.Menu>
                        </ItemDropdown>
                    </ItemDiv>
                    <ItemDiv>
                    <ItemInputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">제목</InputGroup.Text>
                        </InputGroup.Prepend>
                    </ItemInputGroup>
                    <ItemFormControl
                            type="text"
                            placeholder="제목"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            value={this.state.title}
                            onChange={this.changeTitle}
                    ></ItemFormControl>
                    </ItemDiv>
                    <ItemDiv>
                        내용
                    </ItemDiv>
                    <ItemContentsDiv contentEditable="true" id="fileList" >
                    </ItemContentsDiv>
                    {/* <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>내용</Form.Label>
                        <Form.Control as="textarea" rows={3} />
                    </Form.Group> */}
                    {/* <div id="fileList">
                        <p>No files selected!</p>
                    </div>
                    <textarea name="hide" style={{display:'none'}}></textarea> */}
                    <ItemDiv>
                        글 작성에 파일 추가:
                        <input type="file" id="input" name="file" multiple onChange={this.handleFiles}></input>
                    </ItemDiv>
                    <ItemDiv>
                        다운로드용 파일 업로드:
                        <input type="file" id="input" name="file" multiple onChange={this.handleAttachedFiles}></input>
                    </ItemDiv>
                    <ItemDiv>업로드 파일 목록</ItemDiv>
                    {
                        this.state.attachedFiles.map((file,i) => {
                            return <ItemDiv key={file.name+i}>
                                {file.name}
                                { (User.getUserId()) &&
                                    <button variant="primary" type="button" onClick={() => this.deleteAttachedFile(file, i)}>
                                        <i className="fas fa-backspace"></i>
                                    </button>
                                }
                            </ItemDiv>
                        })
                    }
                    <BottomDiv>
                        <Button variant="primary" onClick={this.saveContents} type="submit">
                            저장
                        </Button>
                        <Button variant="primary" onClick={this.cancelContents} type="submit">
                            취소
                        </Button>
                    </BottomDiv>
                </Form>
            </ComponentDiv>
        )
    }
}

export default BoardEditComponent