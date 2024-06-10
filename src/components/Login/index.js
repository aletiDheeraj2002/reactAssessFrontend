import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    checked: false,
    errorMsg: '',
    signUp:false
  }

  handleSubmit = ev => {
    ev.preventDefault()
    this.authenticate()
  }


  authenticate = async () => {
    const {history}=this.props
    const {username, password} = this.state
    
    const url = 'https://reactassessbackend.onrender.com/login'
    const obj = {
      username,
      password,
    }

   
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(obj),
    }
    console.log(options)
    const response = await fetch(url, options)

    const res = await response.json()
    console.log(res)
    if (response.ok === true) {
      Cookies.set('jwt_token', res.token, {expires: 1})
      this.setState({errorMsg: ''})
      history.replace('/')
    } else {
      this.setState({
        errorMsg: res.error,
      })
    }
  }

  handleCheckBox = () => {
    this.setState(prev => ({checked: !prev.checked}))
  }

  handleUsername = ev => {
    this.setState({username: ev.target.value})
  }

  handlePassword = ev => {
    this.setState({password: ev.target.value})
  }

  handleSignUpSubmit = async (ev) =>{
    ev.preventDefault()
    const {username, password} = this.state
    const {history} = this.props
    const url = 'https://reactassessbackend.onrender.com/signup'
    const obj = {
      username,
      password,
    }

   
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(obj),
    }
    console.log(options)
    const response = await fetch(url, options)

    const res = await response.json()
    console.log(res.message)
    const {message}=res;
    history.replace('/')
    this.setState({
        errorMsg:message
    })


  }

  render() {
    const {username, password, checked, errorMsg,signUp} = this.state
    if (Cookies.get('jwt_token') !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="main-cont">
        {
            !signUp && <form className="login-cont" onSubmit={this.handleSubmit}>
            <div className="login-cont-logo-cont">
              <img
                src="https://res.cloudinary.com/dh61azok1/image/upload/v1710056831/image_28_Traced_1_cvv64b.png"
                alt="login website logo"
                className="logo"
              />
              <h1 className="name">
                <span className="nxt">React</span>Assess
              </h1>
            </div>
  
            <div className="input-cont-one input-cont">
              <label htmlFor="username" className="input-label">
                USERNAME
              </label>
              <input
                type="text"
                value={username}
                id="username"
                placeholder=""
                onChange={this.handleUsername}
                className="input-urr-pss"
              />
            </div>
            <div className="input-cont-two input-cont">
              <label htmlFor="password" className="input-label">
                PASSWORD
              </label>
              <input
                type={checked ? 'text' : 'password'}
                value={password}
                id="password"
                placeholder=""
                onChange={this.handlePassword}
                className="input-urr-pss"
              />
            </div>
            <div className="show-password-cont">
              <input
                type="checkbox"
                value={checked}
                id="checkbox"
                onChange={this.handleCheckBox}
                className="input-pss"
              />
              <label htmlFor="checkbox" className="input-pass-txt">
                Show Password
              </label>
            </div>
            <div className="button-cont">
              <button type="submit" className="button">
                Login
              </button>
            </div>
            <p className="error-msg">{errorMsg}</p>
            <div className="signup-div">
            <p className="signup-para" >Not a member? <span className="blue-para" onClick={()=>{this.setState({signUp:true})}}>Sign Up</span></p>
            </div>
            
          </form>
        }
        {
            signUp && <form className="login-cont" onSubmit={this.handleSignUpSubmit}>
            <div className="login-cont-logo-cont">
             
              <h1 className="signup-name">
                  Sign Up Form
              </h1>
            </div>
  
            <div className="input-cont-one input-cont">
              <label htmlFor="username" className="input-label">
                USERNAME
              </label>
              <input
                type="text"
                value={username}
                id="username"
                placeholder=""
                onChange={this.handleUsername}
                className="input-urr-pss"
              />
            </div>
            <div className="input-cont-two input-cont">
              <label htmlFor="password" className="input-label">
                PASSWORD
              </label>
              <input
                type={checked ? 'text' : 'password'}
                value={password}
                id="password"
                placeholder=""
                onChange={this.handlePassword}
                className="input-urr-pss"
              />
            </div>
            <div className="show-password-cont">
              <input
                type="checkbox"
                value={checked}
                id="checkbox"
                onChange={this.handleCheckBox}
                className="input-pss"
              />
              <label htmlFor="checkbox" className="input-pass-txt">
                Show Password
              </label>
            </div>
            <div className="button-cont">
              <button type="submit" className="button">
                Sign Up
              </button>
            </div>
            <p className="error-msg">{errorMsg}</p>
            <div className="signup-div">
            <p className="signup-para" >Created Account? <span className="blue-para" onClick={()=>{this.setState({signUp:false,errorMsg:"",checked:false,username:"",password:""})}}>Sign In</span></p>
            </div>
          </form>
        }
        
      </div>
    )
  }
}
export default Login
