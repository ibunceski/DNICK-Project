import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/Navbar';
import ResourceList from './components/ResourceList';
import AddResourceForm from './components/AddResourceForm';

function App() {
    return (
        <Router>
            <NavigationBar />
            <Routes>
                <Route path="/" element={<ResourceList />} />
                <Route path="/add" element={<AddResourceForm />} />
            </Routes>
        </Router>
    );
}

export default App;
