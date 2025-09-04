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
    const [isDragOver, setIsDragOver] = useState(false);

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

    const handleFileSelect = (file) => {
        setUploadFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (uploadFile && uploadUrl) {
            setAlert({show: true, message: 'Please provide either a file or an URL, not both.', type: 'error'});
            return;
        }
        if (!uploadFile && !uploadUrl && !resource?.upload_file) {
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
            ? axios.patch(`http://localhost:8000/api/resources/${resource.id}/`, formData, {
                headers: {"Content-Type": "multipart/form-data"},
            })
            : axios.post('http://localhost:8000/api/resources/', formData, {
                headers: {"Content-Type": "multipart/form-data"},
            });
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

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-2xl font-semibold mb-6">{resource ? 'Edit Resource' : 'Add New Resource'}</h2>

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

                        {/* Show existing file info if editing */}
                        {resource?.upload_file && !uploadFile && (
                            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-700">
                                    <span className="font-medium">Current file:</span>{" "}
                                    <a
                                        href={resource.upload_file}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 underline hover:text-blue-800"
                                    >
                                        {resource.upload_file.split("/").pop()}
                                    </a>
                                </p>
                                <p className="text-xs text-blue-600 mt-1">
                                    This file will be kept unless you upload a new one
                                </p>
                            </div>
                        )}

                        {/* Custom File Upload Area */}
                        <div
                            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer hover:bg-gray-50 ${
                                isDragOver
                                    ? 'border-blue-400 bg-blue-50'
                                    : uploadFile
                                        ? 'border-green-400 bg-green-50'
                                        : 'border-gray-300'
                            }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={(e) => handleFileSelect(e.target.files[0])}
                                className="hidden"
                            />

                            {uploadFile ? (
                                <div className="space-y-2">
                                    <div className="text-green-600">
                                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                    </div>
                                    <p className="text-sm font-medium text-gray-700">{uploadFile.name}</p>
                                    <p className="text-xs text-gray-500">{formatFileSize(uploadFile.size)}</p>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            clearFile();
                                        }}
                                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
                                    >
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M6 18L18 6M6 6l12 12"/>
                                        </svg>
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="text-gray-400">
                                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                                        </svg>
                                    </div>
                                    <p className="text-sm font-medium text-gray-700">
                                        {isDragOver ? 'Drop your file here' : 'Click to upload or drag and drop'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, etc.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Or Upload URL</label>
                        <input type="url" value={uploadUrl} onChange={e => setUploadUrl(e.target.value)}
                               className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
                               placeholder="https://example.com/document.pdf"/>
                    </div>
                </div>

                {/* Grouped categorization section */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <h3 className="text-lg font-medium text-gray-700">Categorization</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <MultiDropdown label="Resource Types" options={resourceTypes}
                                       selectedValues={selectedResourceTypes} onChange={setSelectedResourceTypes}/>
                        <MultiDropdown label="Keywords" options={keywords} selectedValues={selectedKeywords}
                                       onChange={setSelectedKeywords}/>
                        <MultiDropdown label="Topics" options={topics} selectedValues={selectedTopics}
                                       onChange={setSelectedTopics}/>
                        <MultiDropdown label="Target User Groups" options={targetGroups}
                                       selectedValues={selectedTargetGroups} onChange={setSelectedTargetGroups}/>
                        <MultiDropdown label="Age Groups" options={ageGroups} selectedValues={selectedAgeGroups}
                                       onChange={setSelectedAgeGroups}/>
                    </div>
                </div>

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