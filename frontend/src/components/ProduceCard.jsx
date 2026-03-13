import React from 'react'

const ProduceCard = ({ produce, showBuy, showActions, onDelete }) => {
    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ background: 'rgba(82,183,136,0.08)', borderRadius: 6, padding: '20px', textAlign: 'center', fontSize: '2.5rem' }}>
                
            </div>
            <h4 style={{ color: 'var(--white)' }}>{produce.name}</h4>
            <p style={{ color: 'var(--primary-light)', fontSize: '1.2rem', fontWeight: 700 }}>
                ₹{produce.price} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ {produce.unit}</span>
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                Available: {produce.quantity} {produce.unit}
            </p>
            {produce.farmerId?.name && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Seller: {produce.farmerId.name}</p>
            )}
            <div style={{ marginTop: 'auto', display: 'flex', gap: 8 }}>
                {showBuy && (
                    <button className="btn btn-primary" style={{ flex: 1, padding: '6px 12px', fontSize: '0.82rem' }}>
                        🛒 Buy
                    </button>
                )}
                {showActions && (
                    <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                        onClick={() => onDelete && onDelete(produce._id)}>
                        Delete Remove
                    </button>
                )}
            </div>
        </div>
    )
}

export default ProduceCard
