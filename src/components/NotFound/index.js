import './index.css'

const NotFound = () => (
  <>
    <div className="not-found-container">
      <div className="not-found-image-container">
        <img
          className="not-found-image"
          src="https://res.cloudinary.com/dh61azok1/image/upload/v1713366857/Group_7504_rorf1i.png"
          alt="not found"
        />
      </div>
      <h1 className="not-found-heading">Page Not Found</h1>
      <p className="not-found-paragraph">
        We are Sorry, the page you requested could not be found
      </p>
    </div>
  </>
)

export default NotFound
