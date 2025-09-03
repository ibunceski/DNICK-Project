import {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import MultiDropdown from "./Dropdown.jsx";

function AddResourceForm({resource, onUpdated}) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [author, setAuthor] = useState('');
    const [language, setLanguage] = useState('en');
    const [uploadUrl, setUploadUrl] = useState('');
    const fileInputRef = useRef(null);
    const [uploadFile, setUploadFile] = useState(null);

    const [resourceTypes, setResourceTypes] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [topics, setTopics] = useState([]);
    const [targetGroups, setTargetGroups] = useState([]);
    const [ageGroups, setAgeGroups] = useState([]);

    const [selectedResourceTypes, setSelectedResourceTypes] = useState([]);
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [selectedTargetGroups, setSelectedTargetGroups] = useState([]);
    const [selectedAgeGroups, setSelectedAgeGroups] = useState([]);

    const [alert, setAlert] = useState({show: false, message: '', type: ''});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8000/api/resource-types/').then(res => setResourceTypes(res.data));
        axios.get('http://localhost:8000/api/keywords/').then(res => setKeywords(res.data));
        axios.get('http://localhost:8000/api/topics/').then(res => setTopics(res.data));
        axios.get('http://localhost:8000/api/target-user-groups/').then(res => setTargetGroups(res.data));
        axios.get('http://localhost:8000/api/age-groups/').then(res => setAgeGroups(res.data));
    }, []);

    useEffect(() => {
        if (resource) {
            setTitle(resource.title || '');
            setDescription(resource.description || '');
            setAuthor(resource.author || '');
            setLanguage(resource.language || 'en');
            setUploadUrl(resource.upload_url || '');
            setUploadFile(null);

            setSelectedResourceTypes(resource.resource_type?.map(r => r.id) || []);
            setSelectedKeywords(resource.keywords?.map(k => k.id) || []);
            setSelectedTopics(resource.topic?.map(t => t.id) || []);
            setSelectedTargetGroups(resource.target_user_groups?.map(g => g.id) || []);
            setSelectedAgeGroups(resource.age_groups?.map(a => a.id) || []);
        }

    }, [resource]);

    const clearFile = () => {
        setUploadFile(null);
        if (fileInputRef.current) fileInputRef.current.value = null;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (uploadFile && uploadUrl) {
            setAlert({show: true, message: 'Please provide either a file or an URL, not both.', type: 'error'});
            return;
        }
        if (!uploadFile && !uploadUrl) {
            setAlert({show: true, message: 'Please provide a file or an URL.', type: 'error'});
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('author', author);
        formData.append('language', language);

        if (uploadFile) formData.append('upload_file', uploadFile);
        if (uploadUrl) formData.append('upload_url', uploadUrl);

        selectedResourceTypes.forEach(id => formData.append('resource_type_ids', id));
        selectedKeywords.forEach(id => formData.append('keyword_ids', id));
        selectedTopics.forEach(id => formData.append('topic_ids', id));
        selectedTargetGroups.forEach(id => formData.append('target_user_group_ids', id));
        selectedAgeGroups.forEach(id => formData.append('age_group_ids', id));

        setLoading(true);

        const request = resource
            ? axios.put(`http://localhost:8000/api/resources/${resource.id}/`, formData)
            : axios.post('http://localhost:8000/api/resources/', formData);

        request
            .then((res) => {
                setAlert({
                    show: true,
                    message: resource ? 'Resource updated successfully!' : 'Resource uploaded successfully!',
                    type: 'success'
                });

                if (resource && onUpdated) onUpdated(res.data);
                if (!resource) {
                    setTitle('');
                    setDescription('');
                    setAuthor('');
                    setLanguage('en');
                    setUploadUrl('');
                    setUploadFile(null);
                    setSelectedResourceTypes([]);
                    setSelectedKeywords([]);
                    setSelectedTopics([]);
                    setSelectedTargetGroups([]);
                    setSelectedAgeGroups([]);
                    if (fileInputRef.current) fileInputRef.current.value = null;
                }
            })
            .catch(() => {
                setAlert({show: true, message: 'An error occurred while saving.', type: 'error'});
            })
            .finally(() => setLoading(false));
    };


    return (
        <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-xl">
            {resource ? <h2 className="text-2xl font-semibold mb-6">Edit Resource</h2>
                : <h2 className="text-2xl font-semibold mb-6">Add New Resource</h2>}

            {alert.show && (
                <div
                    className={`mb-4 p-3 rounded-lg ${alert.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {alert.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-1 font-medium">Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required
                               className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"/>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Author</label>
                        <input type="text" value={author} onChange={e => setAuthor(e.target.value)}
                               className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"/>
                    </div>
                </div>

                <div>
                    <label className="block mb-1 font-medium">Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)}
                              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400" rows="3"/>
                </div>

                <div>
                    <label className="block mb-1 font-medium">Language</label>
                    <select value={language} onChange={e => setLanguage(e.target.value)}
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400">
                        <option value="en">English</option>
                        <option value="mk">Macedonian</option>
                        <option value="al">Albanian</option>
                    </select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block mb-1 font-medium">Upload File</label>
                        {resource?.upload_file && !uploadFile && (
                            <p className="text-sm text-gray-600">
                                Currently attached file:{" "}
                                <a
                                    href={resource.upload_file}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 underline"
                                >
                                    {resource.upload_file.split("/").pop()}
                                </a>{" "}
                                (will be re-used if you don’t upload a new one)
                            </p>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => setUploadFile(e.target.files[0])}
                            className="w-full border rounded-lg p-2"
                        />
                        {uploadFile && (
                            <button
                                type="button"
                                onClick={clearFile}
                                className="mt-2 text-sm text-red-500 hover:underline"
                            >
                                Clear File
                            </button>
                        )}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Or Upload URL</label>
                        <input type="url" value={uploadUrl} onChange={e => setUploadUrl(e.target.value)}
                               className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"/>
                    </div>
                </div>

                <MultiDropdown
                    label="Resource Types"
                    options={resourceTypes}
                    selectedValues={selectedResourceTypes}
                    onChange={setSelectedResourceTypes}
                />

                <MultiDropdown
                    label="Keywords"
                    options={keywords}
                    selectedValues={selectedKeywords}
                    onChange={setSelectedKeywords}
                />

                <MultiDropdown
                    label="Topics"
                    options={topics}
                    selectedValues={selectedTopics}
                    onChange={setSelectedTopics}
                />

                <MultiDropdown
                    label="Target User Groups"
                    options={targetGroups}
                    selectedValues={selectedTargetGroups}
                    onChange={setSelectedTargetGroups}
                />

                <MultiDropdown
                    label="Age Groups"
                    options={ageGroups}
                    selectedValues={selectedAgeGroups}
                    onChange={setSelectedAgeGroups}
                />

                <button type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded-lg text-white font-medium transition ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    {loading ? 'Submitting...' : 'Submit Resource'}
                </button>
            </form>
        </div>
    );
}

export default AddResourceForm;
