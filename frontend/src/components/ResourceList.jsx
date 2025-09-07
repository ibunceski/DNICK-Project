import {useEffect, useState, useRef} from "react";
import axios from "axios";
import FilterForm from "./FilterForm.jsx";
import ResourceCard from "./ResourceCard.jsx";
import PaginationControls from "./PaginationControls.jsx";
import AddResourceForm from "./AddResourceForm.jsx";
import DeleteConfirmationModal from "./DeleteModal.jsx";

function ResourceList() {
    const [filteredResources, setFilteredResources] = useState([]);
    const [topics, setTopics] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [ageGroups, setAgeGroups] = useState([]);
    const [resourceTypes, setResourceTypes] = useState([]);
    const [targetUserGroups, setTargetUserGroups] = useState([]);
    const [deleteTarget, setDeleteTarget] = useState(null); // For delete modal
    const [error, setError] = useState(null);
    const [editingResource, setEditingResource] = useState(null);
    const editFormRef = useRef(null);
    const [tempFilters, setTempFilters] = useState({
        title: "", description: "", language: "",
        resource_type: [], target_user_groups: [], age_groups: [],
        keywords: [], topic: [], author: "",
        created_at_after: "", created_at_before: "", has_file: "", has_url: "",
    });
    const [appliedFilters, setAppliedFilters] = useState({...tempFilters});
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(12);

    // Fetch resources
    const fetchResources = async (page = 1) => {
        try {
            setError(null);
            const params = new URLSearchParams({page, page_size: pageSize});
            Object.entries(appliedFilters).forEach(([key, value]) => {
                if (Array.isArray(value) && value.length > 0) params.append(key, value.join(","));
                else if (typeof value === "string" && value !== "") params.append(key, value);
                else if (typeof value === "boolean" && value === true) params.append(key, value);
            });
            const response = await axios.get(`http://localhost:8000/api/resources/?${params}`);
            setFilteredResources(response.data.results || []);
            setTotalPages(Math.ceil(response.data.count / pageSize));
        } catch {
            setError("Failed to fetch resources. Please try again.");
        }
    };

    useEffect(() => {
        if (editingResource && editFormRef.current) {
            editFormRef.current.scrollIntoView({behavior: "smooth", block: "start"});
        }
    }, [editingResource]);

    useEffect(() => {
        Promise.all([
            axios.get("http://localhost:8000/api/topics/"),
            axios.get("http://localhost:8000/api/keywords/"),
            axios.get("http://localhost:8000/api/age-groups/"),
            axios.get("http://localhost:8000/api/resource-types/"),
            axios.get("http://localhost:8000/api/target-user-groups/"),
        ])
            .then(([topicsRes, keywordsRes, ageGroupsRes, resourceTypesRes, targetUserGroupsRes]) => {
                setTopics(topicsRes.data || []);
                setKeywords(keywordsRes.data || []);
                setAgeGroups(ageGroupsRes.data || []);
                setResourceTypes(resourceTypesRes.data || []);
                setTargetUserGroups(targetUserGroupsRes.data || []);
            })
            .catch(() => setError("Failed to fetch dropdown data. Please try again."));
    }, []);

    useEffect(() => {
        fetchResources(currentPage);
    }, [currentPage, pageSize, appliedFilters]);

    const handleApplyFilters = (newFilters) => {
        setAppliedFilters(newFilters);
        setCurrentPage(1);
    };
    const handleClearFilters = () => {
        const emptyFilters = {
            title: "",
            description: "",
            language: "",
            resource_type: [],
            target_user_groups: [],
            age_groups: [],
            keywords: [],
            topic: [],
            author: "",
            created_at_after: "",
            created_at_before: "",
            has_file: "",
            has_url: "",
        };
        setTempFilters(emptyFilters);
        setAppliedFilters(emptyFilters);
        setCurrentPage(1);
    };

    // Open delete modal
    const handleDelete = (id) => setDeleteTarget(id);

    // Confirm delete
    const confirmDelete = () => {
        if (!deleteTarget) return;
        axios.delete(`http://localhost:8000/api/resources/${deleteTarget}/`)
            .then(() => {
                fetchResources(currentPage);
                setDeleteTarget(null);
            })
            .catch(() => {
                setError("Failed to delete resource. Please try again.");
                setDeleteTarget(null);
            });
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">📚 Resources</h2>

            {error && (
                <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700 shadow-sm">{error}</div>
            )}

            <div className="mb-8 bg-white p-6 rounded-2xl shadow-md border border-slate-200">
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
                    languages={["Macedonian", "English", "Albanian"]}
                />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredResources.length > 0 ? (
                    filteredResources.map((resource) => (
                        <ResourceCard
                            key={resource.id}
                            resource={resource}
                            onDelete={() => handleDelete(resource.id)}
                            onEdit={() => setEditingResource(resource)}
                        />
                    ))
                ) : (
                    <p className="col-span-full text-center text-slate-500">No resources match your filters.</p>
                )}
            </div>

            <div className="mt-10 flex justify-center">
                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={setPageSize}
                />
            </div>

            {editingResource && (
                <div ref={editFormRef}>
                    <AddResourceForm
                        resource={editingResource}
                        onClose={() => setEditingResource(null)}
                        onUpdated={() => fetchResources(currentPage)}
                    />
                </div>
            )}

            <DeleteConfirmationModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={confirmDelete}
            />
        </div>
    );
}

export default ResourceList;
