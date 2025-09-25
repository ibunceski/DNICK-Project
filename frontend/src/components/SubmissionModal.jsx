import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FocusTrap from 'focus-trap-react';

function SubmissionModal({ isOpen, onClose, alert, onAddAnother, onSuccessClose, isEditMode }) {
    const modalRef = useRef(null);
    const navigate = useNavigate();

    // Close on ESC
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <FocusTrap>
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
                role="dialog"
                aria-labelledby="modal-title"
                aria-modal="true"
                onClick={onClose}
            >
                <div
                    ref={modalRef}
                    className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Title */}
                    <h3
                        id="modal-title"
                        className={`text-lg font-semibold mb-4 ${
                            alert.type === 'success' ? 'text-green-700' : 'text-red-700'
                        }`}
                    >
                        {alert.type === 'success'
                            ? 'Submission Successful'
                            : 'Submission Failed'}
                    </h3>

                    {/* Message */}
                    <p className="text-gray-600 mb-6">{alert.message}</p>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3">
                        {alert.type === 'success' ? (
                            isEditMode ? (
                                // ✅ For edit mode → just close form
                                <button
                                    name='okay'
                                    onClick={onSuccessClose}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    Okay
                                </button>
                            ) : (
                                <>
                                    <button
                                        name='addanother'
                                        onClick={onAddAnother}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                    >
                                        Add Another Resource
                                    </button>
                                    <button
                                        name='done'
                                        onClick={() => navigate('/')}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Done
                                    </button>
                                </>
                            )
                        ) : (
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                            >
                                Close
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </FocusTrap>
    );
}

export default SubmissionModal;
