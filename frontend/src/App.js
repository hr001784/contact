import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from './config';
import './index.css';

function App() {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalContacts: 0,
    hasNext: false,
    hasPrev: false
  });

  // Fetch contacts
  const fetchContacts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.API_URL}/api/contacts?page=${page}&limit=10`);
      setContacts(response.data.contacts);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setMessage('Error fetching contacts');
    } finally {
      setLoading(false);
    }
  };

  // Load contacts on component mount
  useEffect(() => {
    fetchContacts();
  }, []);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${config.API_URL}/api/contacts`, formData);
      
      // Add new contact to the list
      setContacts(prev => [response.data, ...prev]);
      
      // Clear form
      setFormData({ name: '', email: '', phone: '' });
      setMessage('Contact added successfully!');
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
      
    } catch (error) {
      console.error('Error adding contact:', error);
      setMessage(error.response?.data?.error || 'Error adding contact');
    } finally {
      setLoading(false);
    }
  };

  // Handle contact deletion
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      await axios.delete(`${config.API_URL}/api/contacts/${id}`);
      setContacts(prev => prev.filter(contact => contact.id !== id));
      setMessage('Contact deleted successfully!');
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
      
    } catch (error) {
      console.error('Error deleting contact:', error);
      setMessage(error.response?.data?.error || 'Error deleting contact');
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    fetchContacts(page);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Contact Book</h1>
        <p>Manage your contacts easily</p>
      </header>

      {message && (
        <div className={message.includes('Error') ? 'error-message' : 'success-message'}>
          {message}
        </div>
      )}

      <div className="contact-form">
        <h2 className="form-title">Add New Contact</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter full name"
            />
            {errors.name && <div className="error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter email address"
            />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter 10-digit phone number"
            />
            {errors.phone && <div className="error">{errors.phone}</div>}
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Contact'}
          </button>
        </form>
      </div>

      <div className="contacts-section">
        <h2 className="section-title">Your Contacts</h2>
        
        {loading && contacts.length === 0 ? (
          <div className="loading">Loading contacts...</div>
        ) : contacts.length === 0 ? (
          <div className="no-contacts">No contacts found. Add your first contact above!</div>
        ) : (
          <>
            {contacts.map(contact => (
              <div key={contact.id} className="contact-item">
                <div className="contact-info">
                  <h3>{contact.name}</h3>
                  <p>Email: {contact.email}</p>
                  <p>Phone: {contact.phone}</p>
                </div>
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            ))}

            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                >
                  Previous
                </button>
                
                <span className="pagination-info">
                  Page {pagination.currentPage} of {pagination.totalPages}
                  ({pagination.totalContacts} total contacts)
                </span>
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
