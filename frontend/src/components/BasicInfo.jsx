function BasicInfo({ title, description, author, language, setTitle, setDescription, setAuthor, setLanguage }) {
    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block mb-1 font-medium">Title</label>
                    <input
                        name="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Author</label>
                    <input
                        name="author"
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
                    />
                </div>
            </div>
            <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
                    rows="3"
                />
            </div>
            <div>
                <label className="block mb-1 font-medium">Language</label>
                <select
                    name="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
                >
                    <option value="en">English</option>
                    <option value="mk">Macedonian</option>
                    <option value="al">Albanian</option>
                </select>
            </div>
        </div>
    );
}

export default BasicInfo;