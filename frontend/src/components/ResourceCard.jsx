import PDFViewer from "./PDFViewer.jsx";

function ResourceCard({ resource, onDelete, onEdit }) {
    const getYoutubeEmbedUrl = (url) => {
        const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&]+)/;
        const match = url.match(regex);
        return match ? `https://www.youtube.com/embed/${match[1]}` : null;
    };

    const normalizeUrl = (url) =>
        /^https?:\/\//i.test(url) ? url : "https://" + url;

    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition flex flex-col overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-200 font-semibold text-slate-800">
                {resource.title}
            </div>

            {/* Body */}
            <div className="p-4 flex-1 flex flex-col text-sm text-slate-600">
                <p className="mb-2">{resource.description}</p>
                <p className="mb-1">
                    <span className="font-medium">Created:</span>{" "}
                    {new Date(resource.created_at).toLocaleDateString("en-US", {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })}
                </p>
                <p className="mb-3">
                    <span className="font-medium">Updated:</span>{" "}
                    {new Date(resource.modified_at).toLocaleDateString("en-US", {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })}
                </p>

                {resource.upload_file &&
                    resource.resource_type.some((type) => type.name === "PDF") && (
                        <div className="mb-3">
                            <PDFViewer fileUrl={resource.upload_file} />
                        </div>
                    )}

                {resource.upload_url && (
                    <>
                        {getYoutubeEmbedUrl(resource.upload_url) ? (
                            <div className="aspect-video mb-3 rounded overflow-hidden">
                                <iframe
                                    src={getYoutubeEmbedUrl(resource.upload_url)}
                                    title="YouTube video"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                ></iframe>
                            </div>
                        ) : (
                            <a
                                href={normalizeUrl(resource.upload_url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block w-full text-center px-4 py-2 mb-3 rounded-lg border border-green-500 text-green-600 font-semibold hover:bg-green-50 transition"
                            >
                                🌍 Visit Link
                            </a>
                        )}
                    </>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 flex gap-3">
                <button
                    name='edit'
                    onClick={() => onEdit(resource)}
                    className="flex-1 px-4 py-2 rounded-lg border border-indigo-500 text-indigo-600 font-semibold hover:bg-indigo-50 transition"
                >
                    Edit
                </button>
                <button
                    name='delete'
                    onClick={() => onDelete(resource.id)}
                    className="flex-1 px-4 py-2 rounded-lg border border-red-500 text-red-600 font-semibold hover:bg-red-50 transition"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

export default ResourceCard;
