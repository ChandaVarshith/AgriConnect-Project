import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import API from '../../services/api'

const Community = () => {
    const [posts, setPosts] = useState([])
    const [text, setText] = useState('')

    useEffect(() => {
        API.get('/community').then(res => setPosts(res.data)).catch(console.error)
    }, [])

    const handlePost = async (e) => {
        e.preventDefault()
        try {
            const res = await API.post('/community', { content: text })
            setPosts(prev => [res.data, ...prev])
            setText('')
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
            <Navbar title="Community" publicNav />
            <div className="container" style={{ padding: '40px 24px', maxWidth: 720 }}>
                <h2 className="mb-3">🌍 Farming Community</h2>
                <div className="card mb-3">
                    <form onSubmit={handlePost}>
                        <div className="form-group">
                            <label>Share a Farming Tip</label>
                            <textarea rows={3} placeholder="Share your knowledge with the farming community…"
                                value={text} onChange={e => setText(e.target.value)} required />
                        </div>
                        <button className="btn btn-primary" type="submit">Post Tip</button>
                    </form>
                </div>
                {posts.map(p => (
                    <div key={p._id} className="card mb-2">
                        <p style={{ color: 'var(--text)' }}>{p.content}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>
                            — {p.userId?.name || 'Farmer'} · {new Date(p.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Community
