import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const handleLogoutButton = () => {
    console.log('handlebutton Clicked')
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <div className="header">
      <div className="header-cont-logo-cont">
        <Link to="/">
          <img
            src="https://res.cloudinary.com/dh61azok1/image/upload/v1710247049/image_28_Traced_2_bgpoat.png"
            alt="website logo"
            className="header-logo"
          />
        </Link>

        <h1 className="company-name">
          <span className="nxt">React</span>Assess
        </h1>
      </div>
      <button
        type="button"
        className="logout-button"
        onClick={handleLogoutButton}
      >
        Logout
      </button>
    </div>
  )
}

export default withRouter(Header)
