import { Link } from "react-router-dom";

export default function Dashboard() {
    return (
        <div id="wd-dashboard">
            <h1 id="wd-dashboard-title">Dashboard</h1>
            <hr/>
            <h2 id="wd-dashboard-subtitle">Published Courses (7)</h2>
            <hr/>
            <div className="wd-dashboard-courses row row-cols-1 row-cols-md-5 g-4">
                <div className="wd-dashboard-course col" style={{width: "300px"}}>
                    <div className="card rounded-3 overflow-hidden">
                        <Link className="wd-dashboard-course-link text-decoration-none text-dark"
                              to="/kanbas/courses/1234/home">
                            <img src="images/react.jpg" width="100%" height={160}/>
                            <div className="card-body">
                                <h5 className="wd-dashboard-course-title card-title">
                                    CS1234 React JS
                                </h5>
                                <p className="wd-dashboard-course-title card-text">
                                    Full Stack software developer
                                </p>
                                <button className="btn btn-primary"> Go</button>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="wd-dashboard-course col" style={{width: "300px"}}>
                    <div className="card rounded-3 overflow-hidden">
                        <Link className="wd-dashboard-course-link text-decoration-none text-dark"
                              to="/kanbas/courses/5610/home">
                            <img src="images/react.jpg" width="100%" height={160}/>
                            <div className="card-body">
                                <h5 className="wd-dashboard-course-title card-title">
                                    CS5610 Web Development
                                </h5>
                                <p className="wd-dashboard-course-title card-text">
                                    Full Stack software developer
                                </p>
                                <button className="btn btn-primary"> Go</button>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="wd-dashboard-course col" style={{width: "300px"}}>
                    <div className="card rounded-3 overflow-hidden">
                        <Link className="wd-dashboard-course-link text-decoration-none text-dark"
                              to="/kanbas/courses/5500/home">
                            <img src="images/react.jpg" width="100%" height={160}/>
                            <div className="card-body">
                                <h5 className="wd-dashboard-course-title card-title">
                                    CS5500 Foundations of Software Engineering
                                </h5>
                                <p className="wd-dashboard-course-title card-text">
                                    Full Stack software developer
                                </p>
                                <button className="btn btn-primary"> Go</button>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="wd-dashboard-course col" style={{width: "300px"}}>
                    <div className="card rounded-3 overflow-hidden">
                        <Link className="wd-dashboard-course-link text-decoration-none text-dark"
                              to="/kanbas/courses/5010/home">
                            <img src="images/react.jpg" width="100%" height={160}/>
                            <div className="card-body">
                                <h5 className="wd-dashboard-course-title card-title">
                                    CS5010 Programming Design Paradigm
                                </h5>
                                <p className="wd-dashboard-course-title card-text">
                                    Full Stack software developer
                                </p>
                                <button className="btn btn-primary"> Go</button>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="wd-dashboard-course col" style={{width: "300px"}}>
                    <div className="card rounded-3 overflow-hidden">
                        <Link className="wd-dashboard-course-link text-decoration-none text-dark"
                              to="/kanbas/courses/5800/home">
                            <img src="images/react.jpg" width="100%" height={160}/>
                            <div className="card-body">
                                <h5 className="wd-dashboard-course-title card-title">
                                    CS5800 Algorithms
                                </h5>
                                <p className="wd-dashboard-course-title card-text">
                                    Full Stack software developer
                                </p>
                                <button className="btn btn-primary"> Go</button>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="wd-dashboard-course col" style={{width: "300px"}}>
                    <div className="card rounded-3 overflow-hidden">
                        <Link className="wd-dashboard-course-link text-decoration-none text-dark"
                              to="/kanbas/courses/5520/home">
                            <img src="images/react.jpg" width="100%" height={160}/>
                            <div className="card-body">
                                <h5 className="wd-dashboard-course-title card-title">
                                    CS5520 Mobile Application Development
                                </h5>
                                <p className="wd-dashboard-course-title card-text">
                                    Full Stack software developer
                                </p>
                                <button className="btn btn-primary"> Go</button>
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="wd-dashboard-course col" style={{width: "300px"}}>
                    <div className="card rounded-3 overflow-hidden">
                        <Link className="wd-dashboard-course-link text-decoration-none text-dark"
                              to="/kanbas/courses/5850/home">
                            <img src="images/react.jpg" width="100%" height={160}/>
                            <div className="card-body">
                                <h5 className="wd-dashboard-course-title card-title">
                                    CS5850 Building Game Engines
                                </h5>
                                <p className="wd-dashboard-course-title card-text">
                                    Full Stack software developer
                                </p>
                                <button className="btn btn-primary"> Go</button>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}