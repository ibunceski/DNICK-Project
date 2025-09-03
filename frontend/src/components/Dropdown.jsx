import { useState, useEffect, useRef } from "react";

function MultiDropdown({ label, options, selectedValues, onChange }) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleValue = (value) => {
        if (selectedValues.includes(value)) {
            onChange(selectedValues.filter((v) => v !== value));
        } else {
            onChange([...selectedValues, value]);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="mb-3 w-100" ref={dropdownRef}>
            {label && (
                <label className="form-label fw-bold">{label}</label>
            )}

            <div
                className="dropdown w-100"
                onClick={() => setOpen((prev) => !prev)}
            >
                <button
                    type="button"
                    className="form-control d-flex align-items-center flex-wrap text-start"
                >
                    {selectedValues.length === 0 && (
                        <span className="text-muted">Select...</span>
                    )}
                    {(Array.isArray(selectedValues) ? selectedValues : []).map((val) => {
                        const option = options.find((o) => String(o.id) === String(val));
                        return (
                            <span
                                key={val}
                                className="badge bg-primary d-flex align-items-center me-1 mb-1"
                            >
                                {option?.name}
                                <span
                                    role="button"
                                    className="ms-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleValue(val);
                                    }}
                                >
                                    &times;
                                </span>
                            </span>
                        );
                    })}
                    <span className="ms-auto">&#9662;</span>
                </button>

                {open && (
                    <ul className="dropdown-menu show w-100 mt-1" style={{ maxHeight: "200px", overflowY: "auto" }}>
                        {options.map((opt) => (
                            <li key={opt.id}>
                                <button
                                    type="button"
                                    className={`dropdown-item d-flex justify-content-between ${selectedValues.includes(String(opt.id)) ? "active" : ""}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleValue(opt.id);
                                    }}
                                >
                                    {opt.name}
                                    {selectedValues.includes(String(opt.id)) && <span>&#10003;</span>}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default MultiDropdown;
