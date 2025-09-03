import {useEffect, useState} from 'react';
import axios from 'axios';
import PDFViewer from "./PDFViewer.jsx";
import {Card, Button, Container, Row, Col, Form} from "react-bootstrap";
import AddResourceForm from "./AddResourceForm.jsx";

function ResourceList() {
    const [resources, setResources] = useState([]);
    const [filteredResources, setFilteredResources] = useState([]);

    // filters state
    const [topics, setTopics] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [ageGroups, setAgeGroups] = useState([]);

    const [selectedTopic, setSelectedTopic] = useState("");
    const [selectedKeyword, setSelectedKeyword] = useState("");
    const [selectedAgeGroup, setSelectedAgeGroup] = useState("");

    const [editingResource, setEditingResource] = useState(null);


    useEffect(() => {
        // fetch resources
        axios.get("http://localhost:8000/api/resources/")
            .then(res => {
                setResources(res.data);
                setFilteredResources(res.data);
            });

        axios.get("http://localhost:8000/api/topics")
            .then(res => setTopics(res.data || []))


        axios.get("http://localhost:8000/api/keywords")
            .then(res => setKeywords(res.data || []))

        axios.get("http://localhost:8000/api/age-groups/")
            .then(res => setAgeGroups(res.data || []))
    }, []);

    useEffect(() => {
        let filtered = resources.filter(r => {
            const matchTopic = !selectedTopic || (r.topic && r.topic.some(obj => obj.name === selectedTopic));
            const matchKeyword = !selectedKeyword || (r.keywords && r.keywords.some(obj => obj.name === selectedKeyword));
            const matchAgeGroup = !selectedAgeGroup || (r.age_groups && r.age_groups.some(obj => obj.name === selectedAgeGroup));
            return matchTopic && matchKeyword && matchAgeGroup;
        });
        setFilteredResources(filtered);
    }, [selectedTopic, selectedKeyword, selectedAgeGroup, resources]);

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

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this resource?")) {
            axios.delete(`http://localhost:8000/api/resources/${id}/`)
                .then(() => {
                    setResources(prev => prev.filter(r => r.id !== id));
                });
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="mb-4 fw-bold fs-5">Resources</h2>

            <Form className="mb-4 p-3 rounded shadow-sm bg-light">
                <Row className="g-3">
                    <Col md={4}>
                        <Form.Select
                            value={selectedTopic}
                            onChange={(e) => setSelectedTopic(e.target.value)}
                        >
                            <option value="">All Topics</option>
                            {topics.map((t) => (
                                <option key={t.id} value={t.name}>{t.name}</option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col md={4}>
                        <Form.Select
                            value={selectedKeyword}
                            onChange={(e) => setSelectedKeyword(e.target.value)}
                        >
                            <option value="">All Keywords</option>
                            {keywords.map((k) => (
                                <option key={k.id} value={k.name}>{k.name}</option>
                            ))}
                        </Form.Select>
                    </Col>
                    <Col md={4}>
                        <Form.Select
                            value={selectedAgeGroup}
                            onChange={(e) => setSelectedAgeGroup(e.target.value)}
                        >
                            <option value="">All Age Groups</option>
                            {ageGroups.map((a) => (
                                <option key={a.id} value={a.name}>{a.name}</option>
                            ))}
                        </Form.Select>

                    </Col>
                </Row>
            </Form>

            <Row>
                {filteredResources.length > 0 ? (
                    filteredResources.map(resource => (
                        <Col md={6} lg={4} key={resource.id} className="mb-4">
                            <Card className="h-100 shadow-lg border-0 rounded-3 hover-card">
                                <Card.Header className="bg-white border-0 fw-semibold fs-5">
                                    {resource.title}
                                </Card.Header>
                                <Card.Body className="d-flex flex-column">
                                    <Card.Text className="text-muted small mb-3">
                                        {resource.description}
                                    </Card.Text>
                                    <Card.Text className="text-muted small mb-3">
                                        Created at: {new Date(resource.created_at).toLocaleDateString("en-US", {
                                        weekday: "short",
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric"
                                    })}
                                    </Card.Text>
                                    <Card.Text className="text-muted small mb-3">
                                        Last modified at: {new Date(resource.modified_at).toLocaleDateString("en-US", {
                                        weekday: "short",
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric"
                                    })}
                                    </Card.Text>

                                    {resource.upload_file && resource.resource_type.some(type => type.name == "PDF") && (
                                        <div className="mb-3">
                                            <PDFViewer fileUrl={resource.upload_file}/>
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
                                        onClick={() => handleDelete(resource.id)}
                                    >
                                        Delete
                                    </Button>

                                    <Button
                                        variant="outline-primary"
                                        className="w-100 fw-semibold mb-2"
                                        onClick={() => setEditingResource(resource)}
                                    >
                                        Edit
                                    </Button>
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p className="text-center text-muted">No resources match your filters.</p>
                )}
            </Row>
            {editingResource && (
                <AddResourceForm
                    resource={editingResource}
                    onClose={() => setEditingResource(null)}
                    onUpdated={(updated) => {
                        setResources(prev =>
                            prev.map(r => (r.id === updated.id ? updated : r))
                        );
                        setEditingResource(null);
                    }}
                />
            )}
        </Container>
    )
        ;

}

export default ResourceList;
