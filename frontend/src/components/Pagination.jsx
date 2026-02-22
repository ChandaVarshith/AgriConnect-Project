import React from 'react'

const Pagination = ({ page, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null

    return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24, flexWrap: 'wrap' }}>
            <button className="btn btn-outline" style={{ padding: '6px 14px' }}
                disabled={page === 1} onClick={() => onPageChange(page - 1)}>← Prev</button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p}
                    className={`btn ${p === page ? 'btn-primary' : 'btn-outline'}`}
                    style={{ padding: '6px 14px', minWidth: 38 }}
                    onClick={() => onPageChange(p)}>{p}</button>
            ))}

            <button className="btn btn-outline" style={{ padding: '6px 14px' }}
                disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>Next →</button>
        </div>
    )
}

export default Pagination
