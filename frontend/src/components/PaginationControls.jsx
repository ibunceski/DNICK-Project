function PaginationControls({
                                currentPage,
                                totalPages,
                                pageSize,
                                onPageChange,
                                onPageSizeChange,
                            }) {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                >
                    ⏮ First
                </button>
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                >
                    ◀ Prev
                </button>

                <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`px-3 py-1 rounded ${
                                currentPage === page
                                    ? "bg-indigo-600 text-white"
                                    : "border border-slate-300 text-slate-600 hover:bg-slate-100"
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                >
                    Next ▶
                </button>
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                >
                    Last ⏭
                </button>
            </div>

            <div className="flex items-center gap-2">
                <label className="text-sm text-slate-600">Resources per page:</label>
                <select
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
                    className="rounded border-slate-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={48}>48</option>
                </select>
            </div>
        </div>
    );
}

export default PaginationControls;
