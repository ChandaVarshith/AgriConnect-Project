import React, { useEffect, useState } from 'react'
import PageLayout from '../../components/PageLayout'
import API from '../../services/api'
import './Community.css'

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
        <PageLayout role="public" publicNav title="🌍 Farming Community">
            <div className="community-content">
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
                        <p className="community-post-content">{p.content}</p>
                        <p className="community-post-meta">
                            — {p.userId?.name || 'Farmer'} · {new Date(p.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>
        </PageLayout>
    )
}

export default Community
