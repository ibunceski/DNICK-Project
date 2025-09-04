import { useState } from 'react';

function PDFViewer({ fileUrl }) {
    const [show, setShow] = useState(true);

    return (
        <div className="mt-4">
            <button
                type="button"
                onClick={() => setShow(!show)}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors mb-2"
            >
                {show ? 'Hide PDF' : 'Show PDF'}
            </button>
            {show && (
                <div className="aspect-w-4 aspect-h-3">
                    <iframe
                        src={fileUrl}
                        title="PDF Viewer"
                        className="w-full h-full rounded-md border border-gray-300"
                    ></iframe>
                </div>
            )}
        </div>
    );
}

export default PDFViewer;