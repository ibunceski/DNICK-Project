import { useRef, useState } from 'react';

function FileUpload({ resource, uploadFile, uploadUrl, setUploadFile, setUploadUrl }) {
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);

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

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="grid md:grid-cols-2 gap-6">
            <div>
                <label className="block mb-1 font-medium">Upload File</label>
                {resource?.upload_file && !uploadFile && (
                    <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-700">
                            <span className="font-medium">Current file:</span>{' '}
                            <a
                                href={resource.upload_file}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 underline hover:text-blue-800"
                            >
                                {resource.upload_file.split('/').pop()}
                            </a>
                        </p>
                        <p className="text-xs text-blue-600 mt-1">This file will be kept unless you upload a new one</p>
                    </div>
                )}
                <div
                    className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer hover:bg-gray-50 ${
                        isDragOver ? 'border-blue-400 bg-blue-50' : uploadFile ? 'border-green-400 bg-green-50' : 'border-gray-300'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        name='upload_file'
                        ref={fileInputRef}
                        onChange={(e) => handleFileSelect(e.target.files[0])}
                        className="hidden"
                    />
                    {uploadFile ? (
                        <div className="space-y-2">
                            <div className="text-green-600">
                                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Remove
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="text-gray-400">
                                <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-gray-700">
                                {isDragOver ? 'Drop your file here' : 'Click to upload or drag and drop'}
                            </p>
                            <p className="text-xs text-gray-500">PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, etc.</p>
                        </div>
                    )}
                </div>
            </div>
            <div>
                <label className="block mb-1 font-medium">Or Upload URL</label>
                <input
                    type="url"
                    value={uploadUrl}
                    name='upload_url'
                    onChange={(e) => setUploadUrl(e.target.value)}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
                    placeholder="https://example.com/document.pdf"
                />
            </div>
        </div>
    );
}

export default FileUpload;