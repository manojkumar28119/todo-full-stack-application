import { Link } from "react-router-dom";
import "./index.css"



const NotFound = () => (
    <div className="not-found-page">
        <div className="w-100 container">
            <div className="row d-flex flex-column align-items-center">
                <div className="col-md-6 d-flex flex-column align-items-center">
                    <img src="https://todoist.b-cdn.net/assets/images/e8598664906eb53a9cdc83774e4a5f8a-precache.png"
                    alt="notfound" />
                    <p className="fw-bolder mb-2">Workspace not found.</p>
                    <Link to = "/login">
                        <button type="button" className="btn btn-danger">Back to Home view</button>
                    </Link>
                </div>
            </div>
        </div>
    </div>
)


export default NotFound