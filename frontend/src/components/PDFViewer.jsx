// import {useState} from 'react';
// import {Button} from "react-bootstrap";

function PDFViewer({fileUrl}) {
    // const [show, setShow] = useState(false);

    return (
        <div className="mt-3">
            {/*<Button variant="secondary" onClick={() => setShow(!show)}>*/}
            {/*    {show ? "Hide PDF" : "Show PDF"}*/}
            {/*</Button>*/}
            {/*{show && (*/}
            <div className="ratio ratio-4x3 mt-2">
                <iframe src={fileUrl} title="PDF Viewer"></iframe>
            </div>
        </div>
    );
}

export default PDFViewer;
