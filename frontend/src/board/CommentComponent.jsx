import {Component} from "react";
import * as Axios from '../lib/Axios.ts'
import * as Board from './Board.ts'
import styled from 'styled-components';
import * as User from '../user/User.ts';
const ItemDiv = styled.div`
margin: 10px;
`;
const Button = styled.button`
margin: 10px;
`;
class CommentComponent extends Component {
    constructor(props) {
        super(props);
        // this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            commentList: [],
            commentListRender: [],
        }
    }
    async componentDidMount() {
        var url = new URL(window.location.href);
        var id = url.searchParams.get("id");
        this.setState({id: id});
        console.log(window.location.search);
        const comment = await Board.getComment('?id='+id);
     
        this.setState({commentList: comment});
        console.log(comment)
        const commentRenderList = this.state.commentList.map((comment,i) => {
            return <div key={comment.time}>
                <ItemDiv>
                {comment.author}-
                {comment.text}-
                {comment.time}/
                {comment.recommendation}/
                {comment.decommendation}
                { (User.getUserId()) &&
                <Button variant="primary" type="button" onClick={() => this.deleteComment(comment, i)}>
                    <i class="fas fa-backspace"></i>
                </Button>
                }
                </ItemDiv>
            </div>
        })
        this.setState({commentListRender: commentRenderList});
    }
    deleteComment = async (e, i) => {
        console.log(e, i);
        if (User.getUserId() === e.author) {
            try {
                let res = await Axios.post('board/deleteComment', 
                {
                    id :e.id,
                });
                this.setState({commentList: this.state.commentList.filter(function(comment,idx) { 
                    return idx !== i
                })});

                const commentRenderList = this.state.commentList.map((comment,i) => {
                    return <div key={comment.time}>
                        <ItemDiv>
                        {comment.author}-
                        {comment.text}-
                        {comment.time}/
                        {comment.recommendation}/
                        {comment.decommendation}
                        { (User.getUserId()) &&
                        <Button variant="primary" type="button" onClick={() => this.deleteComment(comment, i)}>
                            <i class="fas fa-backspace"></i>
                        </Button>
                        }
                        </ItemDiv>
                    </div>
                })
                this.setState({commentListRender: commentRenderList});
            } catch (e) {
                console.log(e);
            }
        }
    }
    render() {
        return (
            <div>
                {this.state.commentListRender}
            </div>
        )
    }
}

export default CommentComponent