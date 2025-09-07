function Alert({ show, message, type }) {
    if (!show) return null;

    return (
        <div
            className={`mb-4 p-3 rounded-lg ${
                type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
        >
            {message}
        </div>
    );
}

export default Alert;