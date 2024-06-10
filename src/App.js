import {Route, Switch} from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import Login from './components/Login'
import Assessment from './components/Assessment'
import Result from './components/Result'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/results" component={Result} />
    <ProtectedRoute exact path="/assessment" component={Assessment} />
    <Route component={NotFound} />
  </Switch>
)

export default App
