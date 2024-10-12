import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminProducts from './products'; // Adjust the import as needed
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for react-toastify
import './CSS/design-submissions.css';

const DesignSubmissions = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDesign, setSelectedDesign] = useState(null); // State to hold selected design
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog visibility

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/design-submissions'); // Ensure this endpoint fetches user-submitted designs
        setDesigns(response.data.data); // Ensure you're accessing the correct path in the response
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, []);

  const handleCreateProduct = (design) => {
    setSelectedDesign(design); // Set the selected design
    setIsDialogOpen(true); // Open the dialog
  };

  const handleRejectDesign = async (designId) => {
    try {
      await axios.delete(`http://localhost:5000/api/design-submissions/${designId}`); // Ensure this URL is correct
      setDesigns((prevDesigns) => prevDesigns.filter((design) => design._id !== designId)); // Remove the rejected design from state
      toast.success('Design Rejected'); // Display success toast
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>Error: {error}</h2>;

  return (
    <div className="design-submissions-container">
      <h1>Design Submissions</h1>
      {designs.length === 0 ? (
        <p>No design submissions available.</p>
      ) : (
        <div className="design-cards">
          {designs.map((design) => (
            <div key={design._id} className="design-card">
              <h2>{design.title}</h2>
              <p><strong>Name:</strong> {design.name}</p>
              <p><strong>Email:</strong> {design.email}</p>
              {design.design && (
                <img src={design.design} alt={design.title} className="design-image" />
              )}
              <p><strong>Phone:</strong> {design.phone}</p>
              <p><strong>Margin:</strong> {design.margin}</p>
              <button onClick={() => handleCreateProduct(design)} className="create-product-button">
                Create Product
              </button>
              <button onClick={() => handleRejectDesign(design._id)} className="reject-button">
                Reject
              </button>
            </div>
          ))}
        </div>
      )}
      {/* Render AdminProducts with the selectedDesign */}
      {selectedDesign && (
        <AdminProducts
          open={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedDesign(null); // Clear selected design when closing
          }}
          selectedDesign={selectedDesign}
          allowImageUpload={false} // Indicate that image upload is not allowed
        />
      )}
      <ToastContainer /> {/* Add ToastContainer here */}
    </div>
  );
};

export default DesignSubmissions;
