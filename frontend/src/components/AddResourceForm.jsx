import { useState, useRef } from 'react';
import BasicInfo from './BasicInfo.jsx';
import FileUpload from './FileUpload.jsx';
import Categorization from './Categorization.jsx';
import SubmissionModal from './SubmissionModal.jsx';
import { useResourceForm } from './useResourceForm.js';

function AddResourceForm({ resource, onUpdated, onClose }) {
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const fileInputRef = useRef(null);

    const {
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
    } = useResourceForm(resource);

    const handleFormSubmit = (e) => {
        handleSubmit(
            e,
            onUpdated,
            (alert) => {
                setAlert(alert);
                setIsModalOpen(true);
            },
            setLoading,
            fileInputRef
        );
    };

    const handleAddAnother = () => {
        resetForm(fileInputRef);
        setIsModalOpen(false);
        setAlert({ show: false, message: '', type: '' });
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setAlert({ show: false, message: '', type: '' });
    };

    // const handleSuccessClose = () => {
    //     setIsModalOpen(false);
    //     setAlert({ show: false, message: '', type: '' });
    // };

    return (
        <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-xl">
            <h2 className="text-2xl font-semibold mb-6">
                {resource ? 'Edit Resource' : 'Add New Resource'}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-6">
                <BasicInfo
                    title={title}
                    description={description}
                    author={author}
                    language={language}
                    setTitle={setTitle}
                    setDescription={setDescription}
                    setAuthor={setAuthor}
                    setLanguage={setLanguage}
                />

                <FileUpload
                    resource={resource}
                    uploadFile={uploadFile}
                    uploadUrl={uploadUrl}
                    setUploadFile={setUploadFile}
                    setUploadUrl={setUploadUrl}
                />

                <Categorization
                    resourceTypes={resourceTypes}
                    keywords={keywords}
                    topics={topics}
                    targetGroups={targetGroups}
                    ageGroups={ageGroups}
                    selectedResourceTypes={selectedResourceTypes}
                    selectedKeywords={selectedKeywords}
                    selectedTopics={selectedTopics}
                    selectedTargetGroups={selectedTargetGroups}
                    selectedAgeGroups={selectedAgeGroups}
                    setSelectedResourceTypes={setSelectedResourceTypes}
                    setSelectedKeywords={setSelectedKeywords}
                    setSelectedTopics={setSelectedTopics}
                    setSelectedTargetGroups={setSelectedTargetGroups}
                    setSelectedAgeGroups={setSelectedAgeGroups}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 rounded-lg text-white font-medium transition ${
                        loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {loading ? 'Submitting...' : 'Submit Resource'}
                </button>
            </form>

            <SubmissionModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                alert={alert}
                onAddAnother={handleAddAnother}
                isEditMode={!!resource}
                onSuccessClose={() => {
                    handleCloseModal();
                    if (onUpdated) {
                        onUpdated();
                    }
                    if (onClose) {
                        onClose();
                    }
                }}
            />

        </div>
    );
}

export default AddResourceForm;
