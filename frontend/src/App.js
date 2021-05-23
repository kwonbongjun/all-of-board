import './App.css';
import Main from './Main.jsx';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import signUpComponent from './user/SignUpCompoenent';
function App () {
    return (
        <div id="app" className="App">
            <Router>
                <Switch>
                    <Route exact path='/signUp' component={signUpComponent} />
                    <Route component={Main} />
                </Switch>
            </Router>
        </div>
    )
}
export default App;