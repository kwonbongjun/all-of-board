import {Component} from "react";
import * as Axios from '../lib/Axios.ts'
import * as Board from './Board.ts'
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
        const commentRenderList = this.state.commentList.map(comment => {
            return <div key={comment.time}>
                <div>{comment.text}</div>
                <div>{comment.author}</div>
                <div>{comment.time}</div>
                <div>{comment.recommendation}</div>
                <div>{comment.decommendation}</div>
            </div>
        })
        this.setState({commentListRender: commentRenderList});
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