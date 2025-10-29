import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import '../styles/theme.css'
import './profile.css'
import axios from '../config/axios'

const Profile = () => {
  const { id } = useParams()
  const [partner, setPartner] = useState(null)
  const [stats, setStats] = useState({ totalMeals: 0, customersServed: 0 })
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        setError('')
        const [pRes, vRes] = await Promise.all([
          axios.get(`http://localhost:6969/api/v1/partner/${id}/profile`, { withCredentials: true }),
          axios.get(`http://localhost:6969/api/v1/partner/${id}/videos`, { withCredentials: true, params: { page: 1, limit: 12 } }),
        ])
        setPartner(pRes.data?.data?.partner || null)
        setStats(pRes.data?.data?.stats || { totalMeals: 0, customersServed: 0 })
        setVideos(vRes.data?.data?.items || [])
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load store')
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchAll()
  }, [id])

  return (
    <div className="profile-page">
      <header className="profile-card container">
        <div className="profile-card-top">
          <div className="profile-avatar">
            <img
              src="https://www.bing.com/th/id/OIP.m1c_K5bpeQdH2BKD6bnAmwHaH_?w=185&h=211&c=8&rs=1&qlt=90&o=6&dpr=2&pid=3.1&rm=2"
              alt="avatar"
              loading="lazy"
            />
          </div>
          <div className="profile-info">
            <div className="pill pill-strong" title="Business name">{partner?.restaurantName || 'business name'}</div>
            <div className="pill" title="Address">{partner?.address || 'Address'}</div>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat">
            <span className="stat-label">total meals</span>
            <span className="stat-value">{stats.totalMeals}</span>
          </div>
          <div className="stat">
            <span className="stat-label">customer serve</span>
            <span className="stat-value">{stats.customersServed}</span>
          </div>
        </div>

        <hr className="profile-divider" />
      </header>

      <main className="container">
        {error && <p className="mb-md" style={{ color: 'var(--text-secondary)' }}>{error}</p>}
        <section className="video-grid">
          {videos.length === 0 && (
            Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="video-cell">
                <span>video</span>
              </div>
            ))
          )}
          {videos.map((it) => (
            <div key={it._id} className="video-cell">
              <video
                className="grid-video"
                src={it.video || it.src}
                muted
                playsInline
                preload="metadata"
                controls
              />
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}

export default Profile
