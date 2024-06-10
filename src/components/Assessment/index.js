import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

// let correctOptionIds = []


// const populateCorrectOptionIds = questions => {
//   console.log('hello gyus')
//   console.log(questions)
//   console.log('hello ditch')
//   correctOptionIds = questions.map(question => {
//     const correctOption = question.options.find(
//       option => option.isCorrect === 'true',
//     )

//     return correctOption.optionId
//   })
// }



function createArrayOfObjects(length) {
  const arrayOfObjects = []

  for (let i = 0; i < length; i += 1) {
    arrayOfObjects.push({status: 'u', oid: null})
  }

  return arrayOfObjects
}

class Assessment extends Component {
  state = {
    assessmentQuestion: [],
    omr: [],
    currentQuestionIndex: 0,
    timer: 600, // 10 minutes in seconds
    apiStatus: apiStatusConstants.initial,
    timeUp: false, // Changed initial value to false
    total: 0,
  }

  componentDidMount() {
    this.getData()
    this.startTimer()
  }

  getData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    try {
      const authToken = 'Bearer ' + Cookies.get('jwt_token');
      const options = {
        method: 'GET',
        headers: {
          'Authorization': authToken,
          'Content-Type': 'application/json'
        }
      };
      const response = await fetch('https://reactassessbackend.onrender.com/assess/questions',options)
      const data = await response.json()
      console.log(data)
      this.setState({total: data?.questions?.length})
      if (response.ok === true) {
        const updatedData = data.questions.map(eachQuestion => ({
          id: eachQuestion.id,
          optionsType: eachQuestion.options_type,
          questionText: eachQuestion.question_text,
          options: eachQuestion.options.map(eachOption => ({
            optionId: eachOption.id,
            text: eachOption.text,
            isCorrect: eachOption.is_correct,
            imageUrl: eachOption.image_url,
          })),
        }))

        // populateCorrectOptionIds(updatedData)
        this.setState({
          omr: createArrayOfObjects(data.questions.length),
          assessmentQuestion: updatedData,
          apiStatus: apiStatusConstants.success,
          total: data?.questions?.length || 0,
        })
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  startTimer = () => {
    this.timerFunction = setInterval(() => {
      const {timer} = this.state
      if (timer > 0) {
        this.setState(prevState => ({timer: prevState.timer - 1}))
      } else {
        clearInterval(this.timerFunction)
        this.endAssessment()
        this.setState({timeUp: true}) // Set timeUp to true when timer ends
      }
    }, 1000)
  }

  onClickRetryButton = () => {
    this.getData()
  }

  endAssessment = () => {
    const {history} = this.props
    const {timeUp} = this.state

    if (!timeUp) {
      // If time is not up, navigate to results with timeUp as true
      history.replace('/results', {timeUp: true})
    }

    clearInterval(this.timerFunction)
  }

  onSubmit = async() => {
    const {history} = this.props
    const {timer, omr} = this.state
    let score = 0
    // omr.forEach((item, index) => {
    //   if (item.status === 'a') {
    //     if (correctOptionIds[index] === item.oid) {
    //       score += 1
    //     }
    //   }
    // })

    const url = 'https://reactassessbackend.onrender.com/updatescore'
    const authToken = 'Bearer ' + Cookies.get('jwt_token');
    const obj = {
      "marksSheet":omr
    }

   
    const options = {
      method: 'POST',
      headers: {
        'Authorization': authToken,
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(obj),
    }
    
    const response = await fetch(url, options)

    const res = await response.json()
    console.log(res)
    score=res.score



    // Convert timer to formatted time string
    const formattedTimer = this.formatTime(timer)

    history.replace('/results', {score, formattedTimer})
    clearInterval(this.timerFunction)
  }

  formatTime = timeInSeconds => {
    const hours = Math.floor(timeInSeconds / 3600)
    const minutes = Math.floor((timeInSeconds % 3600) / 60)
    const seconds = timeInSeconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  renderAssessmentFailure = () => (
    <div className="failure-container">
      <div className="failure-content-card">
        <img
          src="https://res.cloudinary.com/dh61azok1/image/upload/v1713366857/Group_7519_d4mklk.png"
          alt="failure view"
          className="failure-image"
        />
        <h1 className="something-went-wrong">Oops! Something went wrong</h1>
        <p className="some-trouble">We are having some trouble</p>
        <button
          onClick={this.onClickRetryButton}
          className="retry-btn"
          type="button"
        >
          Retry
        </button>
      </div>
    </div>
  )

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#263868" height={50} width={50} />
    </div>
  )

  renderAssessmentSuccess = () => {
    const {timer} = this.state
    const formattedTimer = this.formatTime(timer)

    return (
      <div className="assessment-main-container">
        <div className="assessment-questions-container">
          {this.renderQuestion()}
        </div>
        <div className="summary-timer-container">
          <div className="timer-container">
            <p className="time-heading">Time Left</p>
            <p className="timer">{formattedTimer}</p>
          </div>
          <div className="assessment-summary-container">
            {this.renderAssessmentSummary()}
          </div>
        </div>
      </div>
    )
  }

  renderAssessmentDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderAssessmentSuccess()
      case apiStatusConstants.failure:
        return this.renderAssessmentFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  onClickSummaryButton = id => {
    this.setState({
      currentQuestionIndex: id,
    })
  }

  onClickAnswer = id => {
    const {omr, currentQuestionIndex} = this.state
    console.log(omr)
    const updatedOMR = [...omr] // Create a shallow copy of the original array
    updatedOMR[currentQuestionIndex] = {
      status: 'a',
      oid: id,
    }

    // Update the state with the new object
    this.setState({
      omr: updatedOMR,
    })
  }

  handleOnClickNextBtn = () => {
    const {currentQuestionIndex, assessmentQuestion} = this.state

    if (currentQuestionIndex < assessmentQuestion.length - 1) {
      this.setState(prevState => ({
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
      }))
    }
  }

  renderAssessmentSummary = () => {
    const {total, omr} = this.state

    let a = 0

    omr.forEach(item => {
      if (item.status === 'a') {
        a += 1
      }
    })

    return (
      <div className="assessment-summary">
        <div className="answered-unanswered-card">
          <div className="answered">
            <p className="answered-span">{a}</p>
            <p>Answered Questions</p>
          </div>
          <div className="unanswered">
            <p className="unanswered-span">{total - a}</p>
            <p>Unanswered Questions</p>
          </div>
        </div>
        <hr className="summary-horizontal-line" />
        <div className="question-submit-btn-card">
          <h1 className="question-number-heading">Questions ({total})</h1>
          <div className="question-number-card">
            <ul className="question-number-li">
              {this.renderQuestionNumbers()}
            </ul>
          </div>

          <button onClick={this.onSubmit} type="button" className="submit-btn">
            Submit Assessment
          </button>
        </div>
      </div>
    )
  }

  renderQuestionNumbers = () => {
    const {assessmentQuestion, omr, currentQuestionIndex} = this.state

    return assessmentQuestion.map((item, index) => {
      let buttonClassName = ''
      if (currentQuestionIndex === index) {
        buttonClassName = 'curr'
      } else if (omr[index].status === 'a') {
        buttonClassName = 'ans'
      } else {
        buttonClassName = 'unans'
      }

      return (
        <li className="summary-li" key={item.id}>
          <button
            type="button"
            className={buttonClassName}
            onClick={() => this.onClickSummaryButton(index)}
          >
            {index + 1}
          </button>
        </li>
      )
    })
  }

  renderQuestion = () => {
    const {assessmentQuestion, currentQuestionIndex, omr} = this.state

    const currentQuestion = assessmentQuestion[currentQuestionIndex]

    const {questionText, options, optionsType} = currentQuestion
    let selectedOption = null
    if (optionsType === 'SINGLE_SELECT') {
      if (omr[currentQuestionIndex].status === 'a') {
        selectedOption = omr[currentQuestionIndex].oid
      } else {
        selectedOption = options[0].optionId

        const updatedOMR = [...omr] // Create a shallow copy of the original array
        updatedOMR[currentQuestionIndex] = {
          status: 'a',
          oid: selectedOption,
        }
        this.setState({
          omr: updatedOMR,
        })
      }
    }

    const isLastQuestion =
      currentQuestionIndex === assessmentQuestion.length - 1

    return (
      <div className="question-main-container">
        <p className="question-text">
          {currentQuestionIndex + 1}. {questionText}
        </p>
        <hr className="horizontal-line" />
        {optionsType === 'DEFAULT' && (
          <div className="option-container">
            <ul className="options-ul">{this.renderOptions(options)}</ul>
          </div>
        )}
        {optionsType === 'IMAGE' && (
          <ul className="option-container options-ul">
            {this.renderImageOptions(options)}
          </ul>
        )}
        {optionsType === 'SINGLE_SELECT' && (
          <div className="mini-card">
            <select
              className="select-card"
              onChange={e => this.onClickAnswer(e.target.value)}
              value={selectedOption}
            >
              {this.renderSelectOptions(options)}
            </select>
          </div>
        )}
        <div className="btn-card">
          {optionsType === 'SINGLE_SELECT' && (
            <div className="selected-by-default-cont">
              <p className="selected-by-default">
                <img
                  src="https://res.cloudinary.com/dh61azok1/image/upload/v1713366957/error_wbswpn.jpg"
                  alt=""
                  className="first-option"
                />
                First option is selected by default
              </p>
            </div>
          )}
          {isLastQuestion ? null : (
            <button
              type="button"
              className="nxt-button"
              onClick={this.handleOnClickNextBtn}
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    )
  }

  renderOptions = options => {
    const {currentQuestionIndex, omr} = this.state
    const {oid} = omr[currentQuestionIndex]

    return options.map(option => (
      <li key={option.optionId} className="option-li">
        <button
          type="button"
          className={oid === option.optionId ? 'selected' : 'normal'}
          onClick={() => this.onClickAnswer(option.optionId)}
        >
          {option.text}
        </button>
      </li>
    ))
  }

  renderImageOptions = options => {
    const {currentQuestionIndex, omr} = this.state
    const {oid} = omr[currentQuestionIndex]
    return options.map(option => (
      <li key={option.optionId} className="option-li">
        <img
          className={oid === option.optionId ? 'selectedImg' : 'normalImg'}
          onClick={() => this.onClickAnswer(option.optionId)}
          src={option.imageUrl}
          alt={option.text}
        />
      </li>
    ))
  }

  renderSelectOptions = options =>
    options.map(option => (
      <option
        className="normalOption"
        value={option.optionId}
        key={option.optionId}
      >
        {option.text}
      </option>
    ))

  render() {
    return (
      <div className="assessment-main-main-cont">
        <Header />
        {this.renderAssessmentDetails()}
      </div>
    )
  }
}

export default Assessment
