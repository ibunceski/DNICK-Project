import { useState } from 'react';
import { Button, Form, Row, Col, Collapse } from 'react-bootstrap';

function FilterForm({
                        tempFilters,
                        setTempFilters,
                        onApplyFilters,
                        onClearFilters,
                        topics,
                        keywords,
                        ageGroups,
                        resourceTypes,
                        targetUserGroups,
                    }) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
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

    const toggleFilter = () => {
        setIsFilterOpen(prev => !prev);
        console.log('Filter open state:', !isFilterOpen);
    };

    return (
        <>
            <Button
                variant="primary"
                onClick={toggleFilter}
                aria-controls="filter-collapse"
                aria-expanded={isFilterOpen}
                className="mb-3"
            >
                {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </Button>

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
                                    onClick={() => onApplyFilters(tempFilters)}
                                    className="mt-3 me-2"
                                >
                                    Apply Filters
                                </Button>
                                <Button
                                    variant="outline-secondary"
                                    onClick={onClearFilters}
                                    className="mt-3"
                                >
                                    Clear All Filters
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </Collapse>
        </>
    );
}

export default FilterForm;