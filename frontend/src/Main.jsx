import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import StatisticsComponent from './statistics/StatisticsComponent.jsx';
import BoardComponent from './board/BoardComponent.jsx';
import BoardContentsComponent from './board/BoardContentsComponent';
import Test2 from './test2';
import * as User from './user/User.ts';
import {Component} from "react";
import styled from 'styled-components';
import BoardEditComponent from './board/BoardEditComponent.jsx';
import * as Axios from './lib/Axios.ts'
import MapComponent from './MapComponent'
function LogoutComponent(props) {
  async function logout() {
    try {
      await Axios.get('logout');
      // await axios({
      //   method: 'get',
      //   url: 'http://localhost:8080/logout',
      //   headers: {
      //     'content-type': 'application/json;charset=utf-8'
      //   },
      //   withCredentials: true
      // });
      User.initUserInfo();
      window.location.href="/index.html";
    } catch(e) {
      console.log(e);
    }
  }
  return (
    <button onClick={logout} className="Button">{props.children}</button>
  )
}
function LoginComponent(props) {
  async function login() {
      window.location.href="/login.html";
  }
  return (
    <Button onClick={login}>{props.children}</Button>
  )
}
const StyledRootDiv = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap; //넘어가냐
  //flex-flow: column nowrap 하면 위 두줄과 같다.
  justify-content: flex-start; // 메인축 방향 정렬(가로)
  align-items: stretch; //메인축과 수직 방향 정렬
  // algin-content: // flex-wrap이 2줄 이상되어 wrap인경우 수직축 방향 정렬
`;
const StyledButton = styled.button`
  /* 공통 스타일 */
  display: inline-flex;
  outline: none;
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  padding-left: 1rem;
  padding-right: 1rem;

  /* 크기 */
  height: 2.25rem;
  font-size: 1rem;

  /* 색상 */
  background: #228be6;
  &:hover {
    background: #339af0;
  }
  &:active {
    background: #1c7ed6;
  }

  /* 기타 */
  & + & {
    margin-left: 1rem;
  }
`;
const StyledHeaderDiv = styled.div`
    flex-basis: 15%;//기본 크기 설정
    flex-grow: 0;//얼마나 더 커질 수 있냐 빈공간 메움 빈 공간을 비율대로 나눈다.
    flex-shrink: 1;//얼마나 작아질 수 있는가 0이면 basis보다 작아질 수 없다.
    //flex: 로 위의 세개를 한 번에 지정할 수 있다.
    align-self: auto; //수직정렬
    //order: 눈속임으로 순서 변경할 수있다.
    // text-align: center;
`;
const StyledTabDiv = styled.div`
  // height: 100%;
  display: flex;
  flex-wrap: nowrap; //넘어가냐
  justify-content: flex-start; // 메인축 방향 정렬(가로)
  align-items: stretch; //메인축과 수직 방향 정렬
  width: 1200px;
  margin: 10px auto;
`;
const StyledContainerDiv = styled.div`
  display: flex;
  flex-basis: 70%;//기본 크기 설정
  flex-grow: 0;//얼마나 더 커질 수 있냐 빈공간 메움 빈 공간을 비율대로 나눈다.
  flex-shrink: 1;//얼마나 작아질 수 있는가 0이면 basis보다 작아질 수 없다.
  //flex: 로 위의 세개를 한 번에 지정할 수 있다.
  align-self: auto; //수직정렬
  //order: 눈속임으로 순서 변경할 수있다.
  
  // width: 1200px;
  // margin: 0 10%;
  width: 1200px;
  margin: 0 auto;
  // justify-content: center;
  // align-items: center;
}

`;
const StyledFooterDiv = styled.div`
  flex-basis: 15%;//기본 크기 설정
  flex-grow: 0;//얼마나 더 커질 수 있냐 빈공간 메움 빈 공간을 비율대로 나눈다.
  flex-shrink: 1;//얼마나 작아질 수 있는가 0이면 basis보다 작아질 수 없다.
  //flex: 로 위의 세개를 한 번에 지정할 수 있다.
  align-self: auto; //수직정렬
  //order: 눈속임으로 순서 변경할 수있다.
`;
const StyledTabUl = styled.ul`
  display: flex;
  list-style-type: none;
  // flex-grow: 1;
  // flex-shrink: 1;
  flex-basis: ${props => props.user ? "20%" : "80%"};
  // margin-block-start: 1em;
  // margin-block-end: 1em;
  // margin-inline-start: 0px;
  // margin-inline-end: 0px;
  // padding-inline-start: 40px;
  // background-color: antiquewhite;
  padding: 0;
`;
const StyledTabLi = styled.li`
  // display: list-item;
  flex-basis: auto;
  flex-grow: 1;
  line-height: 30px;
  >a {
    color: black;
    text-decoration: none;
    display: ${props => props.user ? "inline" : "block"};
    width: 100%;
    height: 100%;
    vertical-align: middle;
  }
  background-color: antiquewhite;
  opacity: ${props => props.selected ? "0.5" : "1"};
  &:hover {
    opacity: ${props => props.user ? "1" : "0.5"};
    cursor: ${props => props.user ? "auto" : "pointer"};
  }
`;
const MainDiv = styled.div`
width: 100%;
display: flex;
justify-content: center;
align-items: center;
padding: 10px;
font-size: 10rem;
animation: fadein 3s;
@keyframes fadein {
  from {
      opacity: 0;
  }
  to {
      opacity: 1;
  }
}
`;
const H1 = styled.h1`
  color: aliceblue;
  margin: 10px;
  > a {
    color: black;
    &:hover {
      text-decoration: none;
    }
  }
`;

function RootDiv({ children, ...rest}) {
  return <StyledRootDiv {...rest}>{children}</StyledRootDiv>
}
function Button({ children, ...rest }) {
  return <StyledButton {...rest}>{children}</StyledButton>;
}
function HeaderDiv({ children, ...rest}) {
  return <StyledHeaderDiv {...rest}>{children}</StyledHeaderDiv>
}
function TabDiv({ children, ...rest}) {
  return <StyledTabDiv {...rest}>{children}</StyledTabDiv>
}
function ContainerDiv({ children, ...rest}) {
  return <StyledContainerDiv {...rest}>{children}</StyledContainerDiv>
}
function FooterDiv({ children, ...rest}) {
  return <StyledFooterDiv {...rest}>{children}</StyledFooterDiv>
}
function TabUl({ children, ...rest}) {
  return <StyledTabUl {...rest}>{children}</StyledTabUl>
}
class TabLi extends Component {
  constructor(props) {
    super(props);
    this.clickTab = this.clickTab.bind(this);
  }
  componentDidMount() {
    if (window.location.pathname===this.props.tab.path)
      this.props.selectTab(this.props.tab);
  }
  componentDidUpdate() {
  }
  clickTab() {
    this.props.selectTab(this.props.tab);
  }
  render() {
    return <StyledTabLi onClick={this.clickTab} selected={this.props.tab.selected? true: false}>{this.props.children}</StyledTabLi>
  }
}
function TabUserLi({ children, ...rest}) {
  return <StyledTabLi {...rest}>{children}</StyledTabLi>
}
const StyledI = styled.i`
  // display: list-item;
  margin: 3px;
  // vertical-align: middle;
`;
// function I({children, ...rest}) {
//   return <StyledI {...rest}>{children}</StyledI>
// }
class Main extends Component {
// const [message, setMessage] = useState("");
// useEffect(() => {
// fetch('/all')
// .then(response => response.text())
// .then(message => {
// setMessage(message);
// });
// },[])
constructor(props) {
  super(props);
  User.isLoggedIn().then(res => {
    this.setState({
      id: User.getUserId(),
    });
  })
  
  this.state = {
    id: User.getUserId(),
    tab: [
      {
        name: '지도',
        path: '/map',
        component: MapComponent,
        selected: false,
        privileged: 'user',
      },
      {
      name: '통계',
      path: '/statistics',
      component: StatisticsComponent,
      selected: false,
      privileged: 'user',
    },
    {
      name: '게시판',
      path: '/board',
      component: BoardComponent,
      selected: false,
      privileged: 'anonymous',
    },
    {
      name: '관리자',
      path: '/test2',
      component: Test2,
      selected: false,
      privileged: 'admin',
    },
    // {
    //   name: '회원가입',
    //   path: '/signUp',
    //   component: signUpComponent,
    //   selected: false,
    //   privileged: 'anonymous',
    // },
    ]
  }
  
  this.selectTab = this.selectTab.bind(this);
}
componentDidMount() {
}
componentDidUpdate() {
}
selectTab(tab) {
  const selectedTab = this.state.tab.find(tabItem => tabItem.name === tab.name);
  const tabs = this.state.tab.map(tabItem => {
      return {
        name: tabItem.name,
        path: tabItem.path,
        component: tabItem.component,
        selected: tabItem === selectedTab,
        privileged: tabItem.privileged,
      }
  })
  this.setState({
    tab: tabs
  });  
}

render() {
  const listItems = this.state.tab.map((tab) => {
    if (tab.privileged !== 'admin' || (tab.privileged === 'admin' && this.state.id === 'admin')) {
      return <TabLi key={tab.name} tab={tab} selectTab={this.selectTab}><Link to={tab.path}>{tab.name}</Link></TabLi>
    }
  });
  return (
    <RootDiv>
      {/* <Router> */}
        <HeaderDiv id="header">
          <H1><Link to="/">AllOfBoard</Link></H1>
          <TabDiv>
            <TabUl>
              {listItems}
            </TabUl>
            <TabUl user>
              <TabUserLi user>
                {/* <i class="fas fa-user"></i> */}
                <Link to='/signUp'><StyledI className="fas fa-user"></StyledI>회원가입</Link>
              </TabUserLi>
              { 
                (this.state.id === undefined) &&
                <TabUserLi user>
                  <LoginComponent>로그인</LoginComponent>
                </TabUserLi>
              }
              { 
                (this.state.id !== undefined) &&
                <TabUserLi user>
                  <LogoutComponent>로그아웃</LogoutComponent>
                </TabUserLi>
              }
            </TabUl>
          </TabDiv>
        </HeaderDiv>
        <ContainerDiv>
          <Switch>
            <Route exact path='/map' component={MapComponent} />
            <Route exact path='/statistics' component={StatisticsComponent} />
            <Route exact path='/board' component={BoardComponent} />
            <Route path='/test2' component={Test2} />
            <Route exact path='/board/edit' component={BoardEditComponent} />
            <Route exact path='/board/contents' component={BoardContentsComponent} />
            <Route exact path='/'>
              <MainDiv>
                WELCOME
              </MainDiv>
            </Route>
            {/* <Route exact path='/signUp' component={signUpComponent} /> */}
          </Switch>
        </ContainerDiv>
        <FooterDiv>
          <p>hello</p>
        </FooterDiv>
      {/* </Router> */}
    </RootDiv>
    )
}

}
export default Main;