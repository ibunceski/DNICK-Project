import {useState} from "react";
import {Form} from "react-bootstrap";

function FileUpload({onFileSelect, existingFile}) {
    const [fileName, setFileName] = useState(existingFile ? existingFile : "");

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            onFileSelect(file);
        }
    };

    return (
        <Form.Group>
            <Form.Label>Upload File</Form.Label>
            <div className="d-flex align-items-center gap-2">
                <label className="btn btn-outline-primary mb-0">
                    Choose File
                    <input
                        type="file"
                        style={{display: "none"}}
                        onChange={handleFileChange}
                    />
                </label>
                <span className="text-muted">
          {fileName
              ? fileName
              : existingFile
                  ? `Currently attached: ${existingFile}`
                  : "No file chosen"}
        </span>
            </div>
        </Form.Group>
    );
}

export default FileUpload;