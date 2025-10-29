import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/theme.css'
import './food-add.css'
import axios from '../config/axios'

const FoodAdd = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [video, setVideo] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const fileRef = useRef(null)
  const [previewUrl, setPreviewUrl] = useState('')

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!name || !description || !video) {
      setMessage('Please provide name, description and a video')
      return
    }
    try {
      setSubmitting(true)
      setMessage('')
      const form = new FormData()
      form.append('name', name)
      form.append('description', description)
      form.append('video', video)

      const res = await axios.post('http://localhost:6969/api/v1/food/add', form, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setMessage(res.data?.message || 'Uploaded successfully')
      setName('')
      setDescription('')
      setVideo(null)
      e.target.reset()
      navigate('/')
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to upload')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container">
      <form className="foodadd-card" onSubmit={onSubmit}>
        <div className="foodadd-header">
          <h2 className="foodadd-title">Add Food</h2>
          <p className="foodadd-subtitle">Upload a short vertical video with details</p>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="video">Video</label>
          <input
            id="video"
            ref={fileRef}
            type="file"
            accept="video/*"
            className="visually-hidden"
            onChange={(e) => {
              const f = e.target.files?.[0] || null
              setVideo(f)
              if (previewUrl) URL.revokeObjectURL(previewUrl)
              setPreviewUrl(f ? URL.createObjectURL(f) : '')
            }}
          />
          <button
            type="button"
            className="file-trigger"
            onClick={() => fileRef.current?.click()}
          >
            <span className="file-trigger-icon" aria-hidden="true">
              {/* video camera SVG */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 10.5V7a2 2 0 0 0-2-2H5A2 2 0 0 0 3 7v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3.5l5 3V7.5l-5 3z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="file-trigger-text">{video ? 'Change video' : 'Choose video'}</span>
          </button>
          {video && (
            <div className="file-meta">
              <span className="file-name">{video.name}</span>
              <span className="file-size">{(video.size/1024/1024).toFixed(1)} MB</span>
            </div>
          )}
          <small className="hint">Max 50MB. Recommended aspect 9:16.</small>
          {previewUrl && (
            <div className="preview-wrapper">
              <video className="preview-video" src={previewUrl} controls playsInline muted preload="metadata" />
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter meal name"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="description">Description</label>
          <textarea
            id="description"
            rows="4"
            placeholder="Write a short description"
            className="form-input textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {message && <div className="form-message">{message}</div>}

        <div className="actions">
          <button className="primary-btn" type="submit" disabled={submitting}>
            {submitting ? 'Uploading…' : 'Upload'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default FoodAdd
