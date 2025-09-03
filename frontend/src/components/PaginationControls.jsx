import { Pagination, Form } from 'react-bootstrap';

function PaginationControls({
                                currentPage,
                                totalPages,
                                pageSize,
                                onPageChange,
                                onPageSizeChange,
                            }) {
    return (
        <div className="d-flex justify-content-between align-items-center mt-4">
            <Pagination>
                <Pagination.First onClick={() => onPageChange(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />
                {[...Array(totalPages).keys()].map((page) => (
                    <Pagination.Item
                        key={page + 1}
                        active={page + 1 === currentPage}
                        onClick={() => onPageChange(page + 1)}
                    >
                        {page + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>

            <Form.Group className="d-flex align-items-center">
                <Form.Label className="me-2 mb-0">Resources per page:</Form.Label>
                <Form.Select
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
                    style={{ width: 'auto' }}
                    aria-label="Select resources per page"
                >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </Form.Select>
            </Form.Group>
        </div>
    );
}

export default PaginationControls;