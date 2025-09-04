import { useState } from "react";

function MultiDropdown({ label, options, selectedValues, onChange }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const toggleOption = (id) => {
        if (selectedValues.includes(id)) {
            onChange(selectedValues.filter((v) => v !== id));
        } else {
            onChange([...selectedValues, id]);
        }
    };

    const removeOption = (id, e) => {
        e.stopPropagation();
        onChange(selectedValues.filter((v) => v !== id));
    };

    const selectedNames = options.filter((opt) => selectedValues.includes(opt.id));

    return (
        <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>

            <div
                className="w-full border border-gray-300 rounded-md px-3 py-2 cursor-pointer flex flex-wrap gap-1"
                onClick={() => setOpen(!open)}
            >
                {selectedNames.length > 0 ? (
                    <>
                        {selectedNames.slice(0, 3).map((opt) => (
                            <span
                                key={opt.id}
                                className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full flex items-center gap-1"
                            >
                                {opt.name}
                                <button
                                    type="button"
                                    onClick={(e) => removeOption(opt.id, e)}
                                    className="text-blue-600 hover:text-blue-900"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                        {selectedNames.length > 3 && (
                            <span className="text-sm text-gray-500">
                                +{selectedNames.length - 3} more
                            </span>
                        )}
                    </>
                ) : (
                    <span className="text-gray-400 text-sm">None selected</span>
                )}
                <span className="ml-auto">
                    <svg
                        className={`h-5 w-5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </div>

            {open && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-56 overflow-auto">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full px-3 py-2 border-b text-sm outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                    />
                    {options
                        .filter((opt) => opt.name.toLowerCase().includes(search.toLowerCase()))
                        .map((opt) => (
                            <div
                                key={opt.id}
                                className={`px-3 py-2 cursor-pointer hover:bg-blue-100 flex justify-between items-center ${
                                    selectedValues.includes(opt.id) ? "bg-blue-50" : ""
                                }`}
                                onClick={() => toggleOption(opt.id)}
                            >
                                <span>{opt.name}</span>
                                {selectedValues.includes(opt.id) && (
                                    <svg
                                        className="h-4 w-4 text-blue-500"
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
            )}
        </div>
    );
}

export default MultiDropdown;
