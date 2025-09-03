import {useEffect, useState} from 'react';
import axios from 'axios';
import {Card, Button, Container, Row, Col, Form, Pagination, Collapse} from 'react-bootstrap';
import PDFViewer from './PDFViewer.jsx';
import AddResourceForm from './AddResourceForm.jsx';

function ResourceList() {
    const [filteredResources, setFilteredResources] = useState([]);
    const [topics, setTopics] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [ageGroups, setAgeGroups] = useState([]);
    const [resourceTypes, setResourceTypes] = useState([]);
    const [targetUserGroups, setTargetUserGroups] = useState([]);

    // Filter states (temporary until applied)
    const [tempFilters, setTempFilters] = useState({
        title: '',
        description: '',
        language: '',
        resource_type: [],
        target_user_groups: [],
        age_groups: [],
        keywords: [],
        topic: [],
        author: '',
        created_at_after: '',
        created_at_before: '',
        has_file: '',
        has_url: '',
    });

    // Applied filters (used for fetching)
    const [appliedFilters, setAppliedFilters] = useState({
        title: '',
        description: '',
        language: '',
        resource_type: [],
        target_user_groups: [],
        age_groups: [],
        keywords: [],
        topic: [],
        author: '',
        created_at_after: '',
        created_at_before: '',
        has_file: '',
        has_url: '',
    });

    // State for controlling filter section collapse
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    // State for error handling
    const [error, setError] = useState(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10); // Default page size

    const [editingResource, setEditingResource] = useState(null);

    // Fetch resources with applied filters and pagination
    const fetchResources = async (page = 1) => {
        try {
            setError(null); // Clear previous errors
            const params = new URLSearchParams({
                page,
                page_size: pageSize,
            });

            // Only add non-empty, non-null, and non-false filter values
            Object.entries(appliedFilters).forEach(([key, value]) => {
                if (Array.isArray(value) && value.length > 0) {
                    params.append(key, value.join(','));
                } else if (typeof value === 'string' && value !== '') {
                    params.append(key, value);
                } else if (typeof value === 'boolean' && value === true) {
                    params.append(key, value);
                }
            });

            console.log('Fetching resources with params:', params.toString()); // Debug log
            const response = await axios.get(`http://localhost:8000/api/resources/?${params}`);
            console.log('API response:', response.data); // Debug log
            setFilteredResources(response.data.results || []);
            setTotalPages(Math.ceil(response.data.count / pageSize));
        } catch (error) {
            console.error('Error fetching resources:', error.response?.data || error.message);
            setError('Failed to fetch resources. Please try again.');
        }
    };

    // Fetch related data for dropdowns and initial resources
    useEffect(() => {
        fetchResources(currentPage);
    }, [currentPage, pageSize, appliedFilters]); // Added pageSize to dependencies

    useEffect(() => {
        Promise.all([
            axios.get('http://localhost:8000/api/topics/'),
            axios.get('http://localhost:8000/api/keywords/'),
            axios.get('http://localhost:8000/api/age-groups/'),
            axios.get('http://localhost:8000/api/resource-types/'),
            axios.get('http://localhost:8000/api/target-user-groups/'),
        ])
            .then(([topicsRes, keywordsRes, ageGroupsRes, resourceTypesRes, targetUserGroupsRes]) => {
                setTopics(topicsRes.data || []);
                setKeywords(keywordsRes.data || []);
                setAgeGroups(ageGroupsRes.data || []);
                setResourceTypes(resourceTypesRes.data || []);
                setTargetUserGroups(targetUserGroupsRes.data || []);
            })
            .catch(error => {
                console.error('Error fetching dropdown data:', error.response?.data || error.message);
                setError('Failed to fetch dropdown data. Please try again.');
            });
    }, []);

    // Handle filter changes (update temporary filters)
    const handleFilterChange = (e) => {
        const {name, value, type, checked} = e.target;
        setTempFilters(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleMultiSelectChange = (name, value) => {
        setTempFilters(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    // Apply filters
    const handleApplyFilters = () => {
        setAppliedFilters(tempFilters);
        setCurrentPage(1);
    };

    // Clear all filters
    const handleClearFilters = () => {
        const emptyFilters = {
            title: '',
            description: '',
            language: '',
            resource_type: [],
            target_user_groups: [],
            age_groups: [],
            keywords: [],
            topic: [],
            author: '',
            created_at_after: '',
            created_at_before: '',
            has_file: '',
            has_url: '',
        };
        setTempFilters(emptyFilters);
        setAppliedFilters(emptyFilters);
        setCurrentPage(1);
    };

    // Handle pagination
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Handle page size change
    const handlePageSizeChange = (e) => {
        const newSize = parseInt(e.target.value, 10);
        setPageSize(newSize);
        setCurrentPage(1); // Reset to first page
    };

    // Toggle filter visibility
    const toggleFilter = () => {
        setIsFilterOpen(prev => !prev);
        console.log('Filter open state:', !isFilterOpen); // Debug log
    };

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
        if (window.confirm('Are you sure you want to delete this resource?')) {
            axios.delete(`http://localhost:8000/api/resources/${id}/`)
                .then(() => {
                    fetchResources(currentPage);
                })
                .catch(error => {
                    console.error('Error deleting resource:', error.response?.data || error.message);
                    setError('Failed to delete resource. Please try again.');
                });
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="mb-4 fw-bold fs-5">Resources</h2>

            {/* Error Message */}
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {/* Filter Toggle Button */}
            <Button
                variant="primary"
                onClick={toggleFilter}
                aria-controls="filter-collapse"
                aria-expanded={isFilterOpen}
                className="mb-3"
            >
                {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </Button>

            {/* Collapsible Filter Form */}
            <Collapse in={isFilterOpen}>
                <div id="filter-collapse" className="mb-4">
                    <Form className="p-3 rounded shadow-sm bg-light">
                        <Row className="g-3">
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        value={tempFilters.title}
                                        onChange={handleFilterChange}
                                        placeholder="Search by title"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="description"
                                        value={tempFilters.description}
                                        onChange={handleFilterChange}
                                        placeholder="Search by description"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Language</Form.Label>
                                    <Form.Select
                                        name="language"
                                        value={tempFilters.language}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">All Languages</option>
                                        <option value="en">English</option>
                                        <option value="mk">Macedonian</option>
                                        <option value="al">Albanian</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Topics</Form.Label>
                                    <Form.Select
                                        multiple
                                        name="topic"
                                        value={tempFilters.topic}
                                        onChange={(e) =>
                                            handleMultiSelectChange(
                                                'topic',
                                                Array.from(e.target.selectedOptions, (option) => option.value)
                                            )
                                        }
                                    >
                                        {topics.map((t) => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Keywords</Form.Label>
                                    <Form.Select
                                        multiple
                                        name="keywords"
                                        value={tempFilters.keywords}
                                        onChange={(e) =>
                                            handleMultiSelectChange(
                                                'keywords',
                                                Array.from(e.target.selectedOptions, (option) => option.value)
                                            )
                                        }
                                    >
                                        {keywords.map((k) => (
                                            <option key={k.id} value={k.id}>{k.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Age Groups</Form.Label>
                                    <Form.Select
                                        multiple
                                        name="age_groups"
                                        value={tempFilters.age_groups}
                                        onChange={(e) =>
                                            handleMultiSelectChange(
                                                'age_groups',
                                                Array.from(e.target.selectedOptions, (option) => option.value)
                                            )
                                        }
                                    >
                                        {ageGroups.map((a) => (
                                            <option key={a.id} value={a.id}>{a.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Resource Types</Form.Label>
                                    <Form.Select
                                        multiple
                                        name="resource_type"
                                        value={tempFilters.resource_type}
                                        onChange={(e) =>
                                            handleMultiSelectChange(
                                                'resource_type',
                                                Array.from(e.target.selectedOptions, (option) => option.value)
                                            )
                                        }
                                    >
                                        {resourceTypes.map((rt) => (
                                            <option key={rt.id} value={rt.id}>{rt.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Target User Groups</Form.Label>
                                    <Form.Select
                                        multiple
                                        name="target_user_groups"
                                        value={tempFilters.target_user_groups}
                                        onChange={(e) =>
                                            handleMultiSelectChange(
                                                'target_user_groups',
                                                Array.from(e.target.selectedOptions, (option) => option.value)
                                            )
                                        }
                                    >
                                        {targetUserGroups.map((tug) => (
                                            <option key={tug.id} value={tug.id}>{tug.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Author</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="author"
                                        value={tempFilters.author}
                                        onChange={handleFilterChange}
                                        placeholder="Search by author"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Created After</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="created_at_after"
                                        value={tempFilters.created_at_after}
                                        onChange={handleFilterChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Created Before</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="created_at_before"
                                        value={tempFilters.created_at_before}
                                        onChange={handleFilterChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group>
                                    <Form.Label>Has File</Form.Label>
                                    <Form.Check
                                        type="checkbox"
                                        name="has_file"
                                        checked={tempFilters.has_file}
                                        onChange={handleFilterChange}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Has URL</Form.Label>
                                    <Form.Check
                                        type="checkbox"
                                        name="has_url"
                                        checked={tempFilters.has_url}
                                        onChange={handleFilterChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Button
                                    variant="primary"
                                    onClick={handleApplyFilters}
                                    className="mt-3 me-2"
                                >
                                    Apply Filters
                                </Button>
                                <Button
                                    variant="outline-secondary"
                                    onClick={handleClearFilters}
                                    className="mt-3"
                                >
                                    Clear All Filters
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Collapse>

            {/* Resource List */}
            <Row>
                {filteredResources.length > 0 ? (
                    filteredResources.map((resource) => (
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
                    <p className="text-center text-muted">No resources match your filters or none are available.</p>
                )}
            </Row>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-between align-items-center mt-4">
                <Pagination>
                    <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1}/>
                    <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}/>
                    {[...Array(totalPages).keys()].map((page) => (
                        <Pagination.Item
                            key={page + 1}
                            active={page + 1 === currentPage}
                            onClick={() => handlePageChange(page + 1)}
                        >
                            {page + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)}
                                     disabled={currentPage === totalPages}/>
                    <Pagination.Last onClick={() => handlePageChange(totalPages)}
                                     disabled={currentPage === totalPages}/>
                </Pagination>

                {/* Page Size Selector */}
                <Form.Group className="d-flex align-items-center">
                    <Form.Label className="me-2 mb-0">Resources per page:</Form.Label>
                    <Form.Select
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        style={{width: 'auto'}}
                    >
                        <option value={1}>1</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </Form.Select>
                </Form.Group>
            </div>

            {editingResource && (
                <AddResourceForm
                    resource={editingResource}
                    onClose={() => setEditingResource(null)}
                    onUpdated={() => {
                        fetchResources(currentPage);
                        setEditingResource(null);
                    }}
                />
            )}
        </Container>
    );
}

export default ResourceList;