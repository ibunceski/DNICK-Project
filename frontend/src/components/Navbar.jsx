import {Link} from "react-router-dom";

function NavigationBar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow">
            <div className="container-fluid justify-content-center">
                <ul className="navbar-nav">
                    <li className="nav-item mx-3">
                        <Link to="/" className="nav-link text-white fs-5 fw-semibold">
                            Resources
                        </Link>
                    </li>
                    <li className="nav-item mx-3">
                        <Link to="/add" className="nav-link text-white fs-5 fw-semibold">
                            Add Resource
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default NavigationBar;
