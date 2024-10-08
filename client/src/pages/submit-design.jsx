import React, { useState } from 'react';
import './CSS/SubmitDesign.css';
import ExampleImage from './CSS/example-image.png'; // Import the image

const SubmitDesign = () => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [margin, setMargin] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [toastMessage, setToastMessage] = useState(''); // State for toast message
  const basePrice = 20;

  const handleFile = (file) => {
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation regex
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!image || !title || !name || !email || !phone) {
      setToastMessage('Please fill in all fields and upload a design.');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }

    if (!validateEmail(email)) {
      setToastMessage('Please enter a valid email address.');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }

    if (phone.length !== 10) {
      setToastMessage('Phone number must be exactly 10 digits.');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }

    if (margin < 0 || margin > 40) {
      setToastMessage('Margin must be between $0 and $40.');
      setTimeout(() => setToastMessage(''), 3000);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('design', image);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('margin', margin);

    try {
      const response = await fetch('https://customtees.onrender.com/submit-design', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setToastMessage('Design submitted successfully!');

        // Reset form fields after successful submission
        setTitle('');
        setImage(null);
        setPreview(null);
        setName('');
        setEmail('');
        setPhone('');
        setMargin(0);
      } else {
        throw new Error('Failed to submit design. Please try again.');
      }
    } catch (error) {
      setToastMessage(error.message || 'An error occurred.');
    } finally {
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  return (
    <div className='submit-design-container'>
      {toastMessage && (
        <div className="toast">
          {toastMessage}
        </div>
      )}
      <div className='info-section'>
        <h1>Getting Started</h1>
        <p>Are you a designer, brand, agency, or start-up wanting to create t-shirts? We understand that it can be challenging—finding a reliable print shop, managing inventory, and handling customer service can be overwhelming.</p> 
        <p>What if you could showcase your designs in a high-quality online shop without the hassle? No upfront costs, no inventory, and no shipping responsibilities—sounds great, right?</p> 
        <p>That's where we come in. Upload, design, and launch your own products on demand or as a pre-order campaign—it's your choice!</p>
        <p><i>*As long as you’ve been on CustomTees before, you can launch your own shirts. If you’re new to CustomTees, we’ll still need to take a quick look before your shirt or other product is available for sale.</i></p>
        
        {/* Add image below the text */}
        <img src={ExampleImage} alt="Example design" className="info-image" />
      </div>

      <div className='form-section'>
        <h1>Submit Your Design</h1>
        <form onSubmit={handleSubmit} className='design-form'>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </label>

          <label>
            Phone:
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              required
            />
          </label>

          <label>
            Design Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter design title"
              required
            />
          </label>

          <div
            className={`drop-zone ${dragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="image-preview" />
            ) : (
              <p>Drag & Drop your design here or click to upload</p>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="file-input" />
          </div>

          <label>
            Set Margin ($):
            <input
              type="number"
              value={margin}
              onChange={(e) => setMargin(e.target.value)}
              placeholder="Set your margin"
            />
          </label>

          <p>Base Price: ${basePrice}</p>
          <p>Final Price: ${basePrice + parseInt(margin)}</p>

          <button id="submit-wala-button" type="submit">Submit Design</button>
        </form>
      </div>
    </div>
  );
};

export default SubmitDesign;
