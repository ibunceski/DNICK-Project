import { Link } from "react-router-dom";

function NavigationBar() {
    return (
        <nav className="bg-gray-800 sticky top-0 shadow">
            <div className="container mx-auto flex justify-center p-3">
                <ul className="flex space-x-6">
                    <li>
                        <Link to="/" className="text-white text-lg font-semibold hover:text-blue-400">
                            Resources
                        </Link>
                    </li>
                    <li>
                        <Link to="/add" className="text-white text-lg font-semibold hover:text-blue-400">
                            Add Resource
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default NavigationBar;
