import { useState, useEffect } from 'react';
import axios from 'axios';

export function useResourceForm(resource) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [author, setAuthor] = useState('');
    const [language, setLanguage] = useState('en');
    const [uploadUrl, setUploadUrl] = useState('');
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

    const resetForm = (fileInputRef) => {
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
    };

    const handleSubmit = (e, onUpdated, setAlert, setLoading) => {
        e.preventDefault();
        if (uploadFile && uploadUrl) {
            setAlert({ show: true, message: 'Please provide either a file or an URL, not both.', type: 'error' });
            return;
        }
        if (!uploadFile && !uploadUrl && !resource?.upload_file) {
            setAlert({ show: true, message: 'Please provide a file or an URL.', type: 'error' });
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
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            : axios.post('http://localhost:8000/api/resources/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

        request
            .then((res) => {
                setAlert({
                    show: true,
                    message: resource ? 'Resource updated successfully!' : 'Resource uploaded successfully!',
                    type: 'success',
                });
                if (resource && onUpdated) onUpdated(res.data);
            })
            .catch(() => {
                setAlert({ show: true, message: 'An error occurred while saving.', type: 'error' });
            })
            .finally(() => setLoading(false));
    };

    return {
        title, setTitle,
        description, setDescription,
        author, setAuthor,
        language, setLanguage,
        uploadUrl, setUploadUrl,
        uploadFile, setUploadFile,
        resourceTypes, keywords, topics, targetGroups, ageGroups,
        selectedResourceTypes, setSelectedResourceTypes,
        selectedKeywords, setSelectedKeywords,
        selectedTopics, setSelectedTopics,
        selectedTargetGroups, setSelectedTargetGroups,
        selectedAgeGroups, setSelectedAgeGroups,
        handleSubmit,
        resetForm,
    };
}