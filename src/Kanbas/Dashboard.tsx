import { Link } from "react-router-dom";

export default function Dashboard() {
    return (
        <div id="wd-dashboard">
            <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
            <h2 id="wd-dashboard-subtitle">Published Courses (7)</h2> <hr />
            <div className="wd-dashboard-courses">
                <div className="wd-dashboard-course">
                    <img src="images/react.jpg" width="200" />
                    <div>
                        <p className="wd-dashboard-course-title">
                            <Link className="wd-dashboard-course-link"
                                  to="/kanbas/courses/1234/home">
                                CS1234 React JS
                            </Link>
                        </p>
                        <Link to="/kanbas/courses/1234/home"> Go </Link>
                    </div>
                </div>
                <div className="wd-dashboard-course">
                    <img src="images/react.jpg" width="200" />
                    <div>
                        <p className="wd-dashboard-course-title">
                            <Link className="wd-dashboard-course-link"
                                  to="/kanbas/courses/5610/home">
                                CS5610 Web Development
                            </Link>
                        </p>
                        <Link to="/kanbas/courses/5610/home"> Go </Link>
                    </div>
                </div>
                <div className="wd-dashboard-course">
                    <img src="images/react.jpg" width="200" />
                    <div>
                        <p className="wd-dashboard-course-title">
                            <Link className="wd-dashboard-course-link"
                                  to="/kanbas/courses/5500/home">
                                CS5500 Foundations of Software Engineering
                            </Link>
                        </p>
                        <Link to="/kanbas/courses/5500/home"> Go </Link>
                    </div>
                </div>
                <div className="wd-dashboard-course">
                    <img src="images/react.jpg" width="200" />
                    <div>
                        <p className="wd-dashboard-course-title">
                            <Link className="wd-dashboard-course-link"
                                  to="/kanbas/courses/5010/home">
                                CS5010 Programming Design Paradigm
                            </Link>
                        </p>
                        <Link to="/kanbas/courses/5010/home"> Go </Link>
                    </div>
                </div>
                <div className="wd-dashboard-course">
                    <img src="images/react.jpg" width="200" />
                    <div>
                        <p className="wd-dashboard-course-title">
                            <Link className="wd-dashboard-course-link"
                                  to="/kanbas/courses/5800/home">
                                CS5800 Algorithms
                            </Link>
                        </p>
                        <Link to="/kanbas/courses/5800/home"> Go </Link>
                    </div>
                </div>
                <div className="wd-dashboard-course">
                    <img src="images/react.jpg" width="200" />
                    <div>
                        <p className="wd-dashboard-course-title">
                            <Link className="wd-dashboard-course-link"
                                  to="/kanbas/courses/5520/home">
                                CS5520 Mobile Application Development
                            </Link>
                        </p>
                        <Link to="/kanbas/courses/5520/home"> Go </Link>
                    </div>
                </div>
                <div className="wd-dashboard-course">
                    <img src="images/react.jpg" width="200" />
                    <div>
                        <p className="wd-dashboard-course-title">
                            <Link className="wd-dashboard-course-link"
                                  to="/kanbas/courses/5850/home">
                                CS5850 Building Game Engines
                            </Link>
                        </p>
                        <Link to="/kanbas/courses/5850/home"> Go </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}