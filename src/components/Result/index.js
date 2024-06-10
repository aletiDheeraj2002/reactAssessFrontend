import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Result = props => {
  const {location} = props
  const {state} = location
  const {score, formattedTimer, timeUp} = state

  return (
    <div className="results-main-cont">
      <Header />
      <div className="bg-container">
        {timeUp ? (
          <div className="result-container">
            <img
              src="https://res.cloudinary.com/dh61azok1/image/upload/v1713366858/Group_1_wuiyi9.png"
              alt="time up"
              className="result-image"
            />
            <h1 className="congrats-head">Time is up!</h1>
            <p className="about-time">
              You did not complete the assessment within the time
            </p>
            <div className="time-cont">
              <p className="about-time">Time Taken:</p>
              <p className="about-time-num">{formattedTimer}</p>
            </div>
            <div className="score-cont">
              <p className="about-score">Your score:</p>
              <p className="about-score-num">{score}</p>
            </div>
            <Link to="/assessment">
              <button type="button" className="re-btn">
                Reattempt
              </button>
            </Link>
          </div>
        ) : (
          <div className="result-container">
            <img
              src="https://res.cloudinary.com/dh61azok1/image/upload/v1713366857/Layer_2_jigoel.png"
              alt="submit"
              className="result-image"
            />
            <h1 className="congrats-head">
              Congrats! You completed the assessment.
            </h1>
            <div className="time-cont">
              <p className="text">Time Taken:</p>
              <p className="digit">{formattedTimer}</p>
            </div>
            <div className="score-cont">
              <p className="text">Your score:</p>
              <p className="digit">{score}</p>
            </div>

            <Link to="/assessment">
              <button type="button" className="re-btn">
                Reattempt
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Result
