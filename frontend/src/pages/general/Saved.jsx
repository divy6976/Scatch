import React, { useEffect, useRef, useState } from 'react'
import '../../styles/theme.css'
import './reels.css'
import axios from '../../config/axios'

const Saved = () => {
  const containerRef = useRef(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        setError('')
        setLoading(true)
        const res = await axios.get('http://localhost:6969/api/v1/food/saved', {
          withCredentials: true,
          params: { page: 1, limit: 10 }
        })
        const items = res.data?.data?.foodItems || []
        const normalized = items.map((it) => ({
          id: it._id,
          src: it.video,
          description: it.description || 'No description',
          likeCount: typeof it.likeCount === 'number' ? it.likeCount : 0,
          isLiked: !!it.isLiked,
          saveCount: typeof it.saveCount === 'number' ? it.saveCount : 0,
          isSaved: !!it.isSaved,
          partnerId: it.FoodPartner && typeof it.FoodPartner === 'object' && it.FoodPartner._id 
            ? it.FoodPartner._id 
            : it.FoodPartner
        }))
        setVideos(normalized)
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load saved')
      } finally {
        setLoading(false)
      }
    }
    fetchSaved()
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container || videos.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target
          if (entry.isIntersecting && entry.intersectionRatio > 0.9) {
            video.play().catch(() => {})
          } else {
            video.pause()
            video.currentTime = 0
          }
        })
      },
      { threshold: [0, 0.5, 0.9] }
    )
    const nodeVideos = container.querySelectorAll('video')
    nodeVideos.forEach((v) => observer.observe(v))
    return () => observer.disconnect()
  }, [videos])

  const onVisitStore = (partnerId) => {
    window.location.href = `/store/${partnerId}`
  }

  const toggleLike = async (foodId) => {
    setVideos((prev) => prev.map((v) => {
      if (v.id !== foodId) return v
      const nextLiked = !v.isLiked
      return { ...v, isLiked: nextLiked, likeCount: v.likeCount + (nextLiked ? 1 : -1) }
    }))
    try {
      await axios.post('http://localhost:6969/api/v1/food/like', { foodId }, { withCredentials: true })
    } catch {
      setVideos((prev) => prev.map((v) => {
        if (v.id !== foodId) return v
        const prevLiked = !v.isLiked
        return { ...v, isLiked: prevLiked, likeCount: v.likeCount + (prevLiked ? 1 : -1) }
      }))
    }
  }

  const toggleSave = async (foodId) => {
    setVideos((prev) => prev.map((v) => {
      if (v.id !== foodId) return v
      const nextSaved = !v.isSaved
      return { ...v, isSaved: nextSaved, saveCount: v.saveCount + (nextSaved ? 1 : -1) }
    }))
    try {
      await axios.post('http://localhost:6969/api/v1/food/save', { foodId }, { withCredentials: true })
    } catch {
      setVideos((prev) => prev.map((v) => {
        if (v.id !== foodId) return v
        const prevSaved = !v.isSaved
        return { ...v, isSaved: prevSaved, saveCount: v.saveCount + (prevSaved ? 1 : -1) }
      }))
    }
  }

  return (
    <div ref={containerRef} className="reels-container">
      {loading && videos.length === 0 && (
        <section className="reel">
          <div className="reel-overlay"><p className="reel-desc">Loading…</p></div>
          <video className="reel-video" muted playsInline preload="metadata" />
        </section>
      )}
      {error && (
        <section className="reel">
          <div className="reel-overlay"><p className="reel-desc">{error}</p></div>
          <video className="reel-video" muted playsInline preload="metadata" />
        </section>
      )}
      {!loading && !error && videos.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 21l-7-4-7 4V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v17z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="empty-title">No saved reels till now</p>
        </div>
      )}
      {videos.map((video) => (
        <section key={video.id} className="reel">
          <div className="reel-actions">
            <button className={`action-item ${video.isLiked ? 'active' : ''}`} onClick={() => toggleLike(video.id)} aria-pressed={video.isLiked}>
              <span className="action-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                        fill={video.isLiked ? "#ff4757" : "currentColor"}
                        stroke={video.isLiked ? "#ff4757" : "currentColor"}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="action-label">{video.likeCount}</span>
            </button>
            <button className={`action-item save ${video.isSaved ? 'active' : ''}`} onClick={() => toggleSave(video.id)} aria-pressed={video.isSaved}>
              <span className="action-icon-box">
                {video.isSaved ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 21l-7-4-7 4V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v17z"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              <span className="action-label">{video.saveCount}</span>
            </button>
            <div className="action-item" aria-disabled>
              <span className="action-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="action-label">0</span>
            </div>
          </div>
          <div className="reel-overlay">
            <p className="reel-desc" title={video.description}>{video.description}</p>
            <button className="reel-button" onClick={() => onVisitStore(video.partnerId || video.id)}>visit store</button>
          </div>
          <video className="reel-video" src={video.src} muted playsInline preload="metadata" />
        </section>
      ))}

      <nav className="bottom-nav">
        <a className="nav-item" href="/">
          <span className="nav-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"/>
              <polyline points="9,22 9,12 15,12 15,22"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="nav-label">home</span>
        </a>
        <a className="nav-item active" href="/saved">
          <span className="nav-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="nav-label">saved</span>
        </a>
      </nav>
    </div>
  )
}

export default Saved


