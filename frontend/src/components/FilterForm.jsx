import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
        setTempFilters((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleMultiSelectChange = (name, id) => {
        const prev = tempFilters[name] || [];
        if (prev.includes(id)) {
            setTempFilters({ ...tempFilters, [name]: prev.filter((v) => v !== id) });
        } else {
            setTempFilters({ ...tempFilters, [name]: [...prev, id] });
        }
    };

    const renderMultiSelect = (label, name, options) => {
        const selectedNames = options
            .filter((o) => tempFilters[name]?.includes(o.id))
            .map((o) => o.name);

        return (
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
                <div className="w-full border border-gray-300 rounded-lg px-3 py-2 cursor-pointer flex flex-wrap gap-1 min-h-[3rem]">
                    {selectedNames.length ? (
                        selectedNames.map((n) => (
                            <span
                                key={n}
                                className="bg-indigo-100 text-indigo-800 text-sm px-2 py-1 rounded-full"
                            >
                {n}
              </span>
                        ))
                    ) : (
                        <span className="text-gray-400 text-sm">None selected</span>
                    )}
                </div>
                <div className="mt-1 max-h-40 overflow-auto border border-gray-200 rounded-md">
                    {options.map((o) => (
                        <div
                            key={o.id}
                            className={`px-3 py-2 cursor-pointer flex justify-between items-center hover:bg-indigo-50 ${
                                tempFilters[name]?.includes(o.id) ? "bg-indigo-100" : ""
                            }`}
                            onClick={() => handleMultiSelectChange(name, o.id)}
                        >
                            <span>{o.name}</span>
                            {tempFilters[name]?.includes(o.id) && (
                                <svg
                                    className="h-4 w-4 text-indigo-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="3"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div>
            <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="mb-4 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
                {isFilterOpen ? "Hide Filters" : "Show Filters"}
            </button>

            <AnimatePresence>
                {isFilterOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-6 rounded-2xl shadow-md overflow-hidden"
                    >
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={tempFilters.title}
                                onChange={handleFilterChange}
                                placeholder="Search by title"
                                className="mt-1 w-full rounded-lg border-slate-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-12 px-3"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Description</label>
                            <input
                                type="text"
                                name="description"
                                value={tempFilters.description}
                                onChange={handleFilterChange}
                                placeholder="Search by description"
                                className="mt-1 w-full rounded-lg border-slate-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-12 px-3"
                            />
                        </div>

                        {renderMultiSelect("Language", "language", [
                            { id: "en", name: "English" },
                            { id: "mk", name: "Macedonian" },
                            { id: "al", name: "Albanian" },
                        ])}

                        {renderMultiSelect("Topics", "topic", topics)}
                        {renderMultiSelect("Keywords", "keywords", keywords)}
                        {renderMultiSelect("Age Groups", "age_groups", ageGroups)}
                        {renderMultiSelect("Resource Types", "resource_type", resourceTypes)}
                        {renderMultiSelect("Target User Groups", "target_user_groups", targetUserGroups)}

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Author</label>
                            <input
                                type="text"
                                name="author"
                                value={tempFilters.author}
                                onChange={handleFilterChange}
                                placeholder="Search by author"
                                className="mt-1 w-full rounded-lg border-slate-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-12 px-3"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Created After</label>
                            <input
                                type="date"
                                name="created_at_after"
                                value={tempFilters.created_at_after}
                                onChange={handleFilterChange}
                                className="mt-1 w-full rounded-lg border-slate-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-12 px-3"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Created Before</label>
                            <input
                                type="date"
                                name="created_at_before"
                                value={tempFilters.created_at_before}
                                onChange={handleFilterChange}
                                className="mt-1 w-full rounded-lg border-slate-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 h-12 px-3"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Options</label>
                            <div className="flex items-center gap-4 mt-1">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="has_file"
                                        checked={tempFilters.has_file}
                                        onChange={handleFilterChange}
                                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    Has File
                                </label>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="has_url"
                                        checked={tempFilters.has_url}
                                        onChange={handleFilterChange}
                                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    Has URL
                                </label>
                            </div>
                        </div>

                        <div className="md:col-span-3 flex justify-end gap-4 mt-4">
                            <button
                                onClick={() => onApplyFilters(tempFilters)}
                                className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition"
                            >
                                Apply Filters
                            </button>
                            <button
                                onClick={onClearFilters}
                                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 active:bg-slate-300 transition"
                            >
                                Clear All
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default FilterForm;
