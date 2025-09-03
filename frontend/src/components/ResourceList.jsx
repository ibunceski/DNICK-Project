import { useEffect, useState } from 'react';
import axios from 'axios';
import {Container, Row} from 'react-bootstrap';
import FilterForm from './FilterForm.jsx';
import ResourceCard from './ResourceCard.jsx';
import PaginationControls from './PaginationControls.jsx';
import AddResourceForm from './AddResourceForm.jsx';

function ResourceList() {
    // State for resources and dropdown data
    const [filteredResources, setFilteredResources] = useState([]);
    const [topics, setTopics] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [ageGroups, setAgeGroups] = useState([]);
    const [resourceTypes, setResourceTypes] = useState([]);
    const [targetUserGroups, setTargetUserGroups] = useState([]);

    // Filter states
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

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Other states
    const [error, setError] = useState(null);
    const [editingResource, setEditingResource] = useState(null);

    // Fetch resources
    const fetchResources = async (page = 1) => {
        try {
            setError(null);
            const params = new URLSearchParams({
                page,
                page_size: pageSize,
            });

            Object.entries(appliedFilters).forEach(([key, value]) => {
                if (Array.isArray(value) && value.length > 0) {
                    params.append(key, value.join(','));
                } else if (typeof value === 'string' && value !== '') {
                    params.append(key, value);
                } else if (typeof value === 'boolean' && value === true) {
                    params.append(key, value);
                }
            });

            console.log('Fetching resources with params:', params.toString());
            const response = await axios.get(`http://localhost:8000/api/resources/?${params}`);
            console.log('API response:', response.data);
            setFilteredResources(response.data.results || []);
            setTotalPages(Math.ceil(response.data.count / pageSize));
        } catch (error) {
            console.error('Error fetching resources:', error.response?.data || error.message);
            setError('Failed to fetch resources. Please try again.');
        }
    };

    // Fetch dropdown data
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

    // Fetch resources when pagination or filters change
    useEffect(() => {
        fetchResources(currentPage);
    }, [currentPage, pageSize, appliedFilters]);

    // Handle filter application
    const handleApplyFilters = (newFilters) => {
        setAppliedFilters(newFilters);
        setCurrentPage(1);
    };

    // Handle filter clearing
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

    // Handle page change
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Handle page size change
    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setCurrentPage(1);
    };

    // Handle resource deletion
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

            {/* Filter Form */}
            <FilterForm
                tempFilters={tempFilters}
                setTempFilters={setTempFilters}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
                topics={topics}
                keywords={keywords}
                ageGroups={ageGroups}
                resourceTypes={resourceTypes}
                targetUserGroups={targetUserGroups}
            />

            {/* Resource List */}
            <Row>
                {filteredResources.length > 0 ? (
                    filteredResources.map((resource) => (
                        <ResourceCard
                            key={resource.id}
                            resource={resource}
                            onDelete={handleDelete}
                            onEdit={() => setEditingResource(resource)}
                        />
                    ))
                ) : (
                    <p className="text-center text-muted">No resources match your filters or none are available.</p>
                )}
            </Row>

            {/* Pagination Controls */}
            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
            />

            {/* Edit Resource Form */}
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