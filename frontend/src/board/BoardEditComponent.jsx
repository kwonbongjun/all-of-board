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
                  window.URL.revokeObjectURL(this.src);
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
        this.setState({
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
        try {
            const formData = new FormData();
            formData.append('title', this.state.title);
            formData.append('content',this.state.content);
            formData.append('author',User.getUserId()===undefined?'anonymous':User.getUserId());
            formData.append('view',0);
            formData.append('time',new Date());
            formData.append('recommendation',0);
            formData.append('decommendation',0);
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
    selectCategory = (category) => {
        console.log(category);
        this.setState({category: category});
    }
    render() {
        const categoryRender = categoryList.map(category => {
            return <Dropdown.Item key={category} onClick={() => this.selectCategory(category)}>{category}</Dropdown.Item>
            }
        );
        return (
            <div>
                <Form>
                    카테고리
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {this.state.category}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {categoryRender}
                        </Dropdown.Menu>
                    </Dropdown>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">제목</InputGroup.Text>
                        </InputGroup.Prepend>
                    </InputGroup>
                    <Form.Control
                            type="text"
                            placeholder="Username"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            value={this.state.title}
                            onChange={this.changeTitle}
                    ></Form.Control>
                    <div contentEditable="true" id="fileList" >
                        
                    </div>
                    {/* <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>내용</Form.Label>
                        <Form.Control as="textarea" rows={3} />
                    </Form.Group> */}
                    {/* <div id="fileList">
                        <p>No files selected!</p>
                    </div>
                    <textarea name="hide" style={{display:'none'}}></textarea> */}
                    <div>
                        <input type="file" id="input" name="file" multiple onChange={this.handleFiles}></input>
                    </div>
                    <div>
                        <input type="file" id="input" name="file" multiple onChange={this.handleAttachedFiles}></input>
                    </div>
                    {
                        this.state.attachedFiles.map((file,i) => {
                            return <div key={file.name+i}>{file.name}</div>
                        })
                    }
                    <Button variant="primary" onClick={this.saveContents} type="submit">
                        저장
                    </Button>
                    <Button variant="primary"  type="submit">
                        취소
                    </Button>
                </Form>
            </div>
        )
    }
}

export default BoardEditComponent