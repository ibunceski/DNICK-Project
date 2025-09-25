import React from "react";

function DeleteConfirmationModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-sm">
                <h3 className="text-lg font-semibold text-red-700 mb-4">
                    Confirm Deletion
                </h3>
                <p className="text-slate-600 mb-6">
                    Are you sure you want to delete this resource? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>
                    <button
                        name='confirmdelete'
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmationModal;
