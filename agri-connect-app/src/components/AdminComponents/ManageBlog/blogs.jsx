import React, { useState, useEffect } from 'react';
import { BsCloudPlusFill } from "react-icons/bs";
import './Styles_blogs.css'; 
import { Snackbar, Alert } from '@mui/material'; 
import apiHelper from '../../../features/apiHelper'; // Adjust import path as necessary

const BlogManager = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
  });
  const [alert, setAlert] = useState({
    open: false,
    severity: 'success',
    message: '',
  });
  const [blogs, setBlogs] = useState([]);
  const [editingBlog, setEditingBlog] = useState(null);

  const toggleModal = (blog = null) => {
    setShowModal(!showModal);
    setEditingBlog(blog);
    if (blog) {
      setFormData({
        title: blog.title,
        description: blog.description,
        image: null,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        image: null,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'image' ? files[0] : value,
    });
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') return;
    setAlert({ ...alert, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      setAlert({
        open: true,
        severity: 'error',
        message: 'Title and Description are required!',
      });
      return;
    }

    let blogData;
    if (formData.image) {
      blogData = new FormData();
      blogData.append('title', formData.title);
      blogData.append('description', formData.description);
      blogData.append('image', formData.image);
    } else {
      blogData = {
        title: formData.title,
        description: formData.description,
      };
    }

    try {
      let response;
      if (editingBlog) {
        response = await apiHelper("put", {
          url: `/blogs/${editingBlog.id}`,
          data: blogData,
        });
      } else {
        response = await apiHelper("post", {
          url: "/blogs",
          data: blogData,
        });
      }
      
      if (response.success) {
        setAlert({
          open: true,
          message: response.message || (editingBlog ? "Blog updated successfully!" : "Blog created successfully!"),
          severity: "success",
        });
        setShowModal(false);
        const blogsData = await apiHelper("get", { url: "/blogs" });
        setBlogs(blogsData.data || []);
      } else {
        setAlert({
          open: true,
          message: response.message || (editingBlog ? "Failed to update blog." : "Failed to create blog."),
          severity: "error",
        });
      }
    } catch (error) {
      setAlert({
        open: true,
        message: "Error submitting the blog. Please try again.",
        severity: "error",
      });
      console.error("Error submitting the blog:", error);
    }
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogsData = await apiHelper("get", { url: "/blogs" });
      setBlogs(blogsData.data || []);
    };
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await apiHelper("delete", { url: `/blogs/${id}` });
      if (response.success) {
        setAlert({
          open: true,
          message: "Blog deleted successfully!",
          severity: "success",
        });
        setBlogs(blogs.filter(blog => blog.id !== id));
      } else {
        setAlert({
          open: true,
          message: "Failed to delete blog.",
          severity: "error",
        });
      }
    } catch (error) {
      setAlert({
        open: true,
        message: "Error deleting blog. Please try again.",
        severity: "error",
      });
      console.error("Error deleting blog:", error);
    }
  };

  return (
    <div className="blog-manager-container">
      <h1>Manage Blogs</h1>
      <p>Here you can manage your blogs.</p>

      <button className="open-modal-btn" onClick={() => toggleModal()}>
        <BsCloudPlusFill /> Create New Blog
      </button>

      <table className="blog-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Description</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog, index) => (
            <tr key={blog.id}>
              <td>{index + 1}</td>
              <td>{blog.title}</td>
              <td>{blog.description}</td>
              <td>
                <img src={blog.image} alt={blog.title} className="blog-img" />
              </td>
              <td>
                <button className="edit-btn" onClick={() => toggleModal(blog)}>Update</button>
                <button className="delete-btn" onClick={() => handleDelete(blog.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editingBlog ? "Update Blog" : "Create New Blog"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Image:</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>

              <div className="form-actions">
                <button type="submit">{editingBlog ? "Update" : "Submit"}</button>
                <button type="button" onClick={toggleModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default BlogManager;

