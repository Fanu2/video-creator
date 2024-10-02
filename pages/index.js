// pages/index.js
import { useState } from 'react';

export default function Home() {
  const [images, setImages] = useState([]);
  const [soundFile, setSoundFile] = useState(null);
  const [outputVideoPath, setOutputVideoPath] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleImageChange = (event) => {
    setImages([...event.target.files]);
  };

  const handleSoundChange = (event) => {
    setSoundFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');

    const formData = new FormData();
    images.forEach((file) => {
      formData.append('images', file);
    });
    formData.append('soundFile', soundFile);
    formData.append('outputVideo', outputVideoPath);

    try {
      const response = await fetch('/api/create-video', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setMessage(data.success ? 'Video created successfully!' : data.error);
    } catch (error) {
      setMessage('Error creating video: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Video Creator</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="imageUpload">Upload Images:</label>
          <input
            type="file"
            id="imageUpload"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="soundUpload">Upload Sound File:</label>
          <input
            type="file"
            id="soundUpload"
            accept="audio/*"
            onChange={handleSoundChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="outputVideo">Output Video Path:</label>
          <input
            type="text"
            id="outputVideo"
            placeholder="Enter output video path"
            value={outputVideoPath}
            onChange={(e) => setOutputVideoPath(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn" disabled={isLoading}>
          {isLoading ? 'Generating Video...' : 'Create Video'}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
