import {useState} from "react";

function PDFViewer({fileUrl}) {
    const [show, setShow] = useState(true);

    const openInNewTab = () => {
        if (fileUrl) {
            window.open(fileUrl, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <div className="mt-4">
            <div className="flex gap-2 mb-2">
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors"
                >
                    {show ? "Hide PDF" : "Show PDF"}
                </button>

                <button
                    type="button"
                    onClick={openInNewTab}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
                >
                    Open PDF in New Tab
                </button>
            </div>

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
