import { Card, Button, Col } from 'react-bootstrap';
import PDFViewer from './PDFViewer.jsx';

function ResourceCard({ resource, onDelete, onEdit }) {
    const getYoutubeEmbedUrl = (url) => {
        const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&]+)/;
        const match = url.match(regex);
        return match ? `https://www.youtube.com/embed/${match[1]}` : null;
    };

    const normalizeUrl = (url) => {
        if (!/^https?:\/\//i.test(url)) {
            return 'https://' + url;
        }
        return url;
    };

    return (
        <Col md={6} lg={4} className="mb-4">
            <Card className="h-100 shadow-lg border-0 rounded-3 hover-card">
                <Card.Header className="bg-white border-0 fw-semibold fs-5">
                    {resource.title}
                </Card.Header>
                <Card.Body className="d-flex flex-column">
                    <Card.Text className="text-muted small mb-3">
                        {resource.description}
                    </Card.Text>
                    <Card.Text className="text-muted small mb-3">
                        Created at: {new Date(resource.created_at).toLocaleDateString('en-US', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    })}
                    </Card.Text>
                    <Card.Text className="text-muted small mb-3">
                        Last modified at: {new Date(resource.modified_at).toLocaleDateString('en-US', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                    })}
                    </Card.Text>

                    {resource.upload_file && resource.resource_type.some((type) => type.name === 'PDF') && (
                        <div className="mb-3">
                            <PDFViewer fileUrl={resource.upload_file} />
                        </div>
                    )}

                    {resource.upload_url && (
                        <>
                            {getYoutubeEmbedUrl(resource.upload_url) ? (
                                <div className="ratio ratio-16x9 mb-3 rounded">
                                    <iframe
                                        src={getYoutubeEmbedUrl(resource.upload_url)}
                                        title="YouTube video"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="rounded"
                                    ></iframe>
                                </div>
                            ) : (
                                <Button
                                    variant="outline-success"
                                    className="mb-3 fw-semibold"
                                    href={normalizeUrl(resource.upload_url)}
                                    target="_blank"
                                >
                                    🌍 Visit Link
                                </Button>
                            )}
                        </>
                    )}
                </Card.Body>
                <Card.Footer className="bg-white border-0">
                    <Button
                        variant="outline-danger"
                        className="w-100 fw-semibold"
                        onClick={() => onDelete(resource.id)}
                    >
                        Delete
                    </Button>
                    <Button
                        variant="outline-primary"
                        className="w-100 fw-semibold mb-2"
                        onClick={onEdit}
                    >
                        Edit
                    </Button>
                </Card.Footer>
            </Card>
        </Col>
    );
}

export default ResourceCard;