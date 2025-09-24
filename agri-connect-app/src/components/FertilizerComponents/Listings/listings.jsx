import React, { useState, useEffect } from 'react';
import {
  Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogActions, DialogContent, DialogTitle, TextField, Radio, RadioGroup,
  FormControlLabel, FormControl, FormLabel, IconButton, Grid, Typography, Snackbar,
  Alert
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import apiHelper from "../../../features/apiHelper.js";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/slices/authSlice.js";


const Listings = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    qty: '',
    description: '',
    price: '',
    availability: 0,
    productType: '',
    image: null,
  });
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const user = useSelector(selectUser);
  const userId = user.id;

  // Toggle modal visibility
  const toggleModal = (product = null) => {
    setShowModal(!showModal);
    setEditingProduct(product);
    if (product) {
      setFormData({
        name: product.name,
        qty: product.qty,
        description: product.description,
        price: product.price,
        availability: product.availability,
        productType: product.productType,
        image: null,
      });
    } else {
      setFormData({
        name: '',
        qty: '',
        description: '',
        price: '',
        availability: 0,
        productType: '',
        image: null,
      });
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'image' && files ? files[0] : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!formData.name || !formData.qty || !formData.price) {
      setAlert({
        open: true,
        message: "Please fill in all required fields.",
        severity: "error",
      });
      return;
    }

    if (isNaN(formData.qty) || isNaN(formData.price)) {
      setAlert({
        open: true,
        message: "Quantity and price must be valid numbers.",
        severity: "error",
      });
      return;
    }

    let productData;
    if (formData.image) {
      productData = new FormData();
      productData.append('name', formData.name);
      productData.append('qty', formData.qty);
      productData.append('description', formData.description);
      productData.append('price', formData.price);
      productData.append('availability', formData.availability);
      productData.append('productType', formData.productType);
      productData.append('image', formData.image); // Ensure file is appended
      productData.append('userId', userId);
    } else {
      productData = {
        name: formData.name,
        qty: formData.qty,
        description: formData.description,
        price: formData.price,
        availability: formData.availability,
        productType: formData.productType,
        userId: userId,
      };
    }

    try {
      let response;
      if (editingProduct) {
        response = await apiHelper('put', {
          url: `/product/${editingProduct.id}`,
          data: productData,
        });
      } else {
        response = await apiHelper('post', {
          url: '/product',
          data: productData,
        });
      }

      if (response.success) {
        setAlert({
          open: true,
          message: response.message || "Product submitted successfully!",
          severity: "success",
        });
        setShowModal(false);
        const productsData = await apiHelper('get', { url: `/product/user/${userId}` });
        setProducts(productsData.data || []);
      } else {
        setAlert({
          open: true,
          message: response.message || "Submission failed.",
          severity: "error",
        });
      }
    } catch (error) {
      setAlert({
        open: true,
        message: "Error submitting product.",
        severity: "error",
      });
      console.error('Error submitting product:', error);
    }
  };

  // Fetch products data on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await apiHelper('get', { url: `/product/user/${userId}` });
        setProducts(productsData.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [userId]);

  // Handle delete
  const handleDelete = async (id) => {
    try {
      const response = await apiHelper('delete', { url: `/product/${id}` });
      if (response.success) {
        setProducts(products.filter(product => product.id !== id));
      } else {
        setAlert({
          open: true,
          message: response.message || "Failed to delete product.",
          severity: "error",
        });
      }
    } catch (error) {
      setAlert({
        open: true,
        message: "Error deleting product.",
        severity: "error",
      });
      console.error('Error deleting product:', error);
    }
  };

  // Handle Snackbar close
  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <div className="vendor-manager">
      <Typography variant="h4" gutterBottom>Manage Listings</Typography>
      <Typography variant="body1" paragraph>Here you can manage your fertilizer products.</Typography>

      {/* Button to open the modal */}
      <Button variant="contained" color="primary" onClick={() => toggleModal()}>
        Add New Product
      </Button>

      {/* Product List Table */}
 <TableContainer component={Paper} className="product-table">
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Id</TableCell>
        <TableCell>Name</TableCell>
        <TableCell>Qty</TableCell>
        <TableCell>Description</TableCell>
        <TableCell>Price</TableCell>
        <TableCell>Availability</TableCell>
        <TableCell>Product Type</TableCell>
        <TableCell>Image</TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {products.length > 0 ? (
        products.map((product, index) => (
          <TableRow key={product.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.qty}</TableCell>
            <TableCell>{product.description}</TableCell>
            <TableCell>Rs{product.price}</TableCell>
            <TableCell>{product.availability === 0 ? 'Yes' : 'No'}</TableCell>
            <TableCell>{product.productType}</TableCell>
            <TableCell>
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-img"
                  style={{ width: '100px', height: '100px' }}
                />
              ) : (
                <Typography variant="body2">No Image</Typography>
              )}
            </TableCell>
            <TableCell>
              <IconButton color="primary" onClick={() => toggleModal(product)}>
                <Edit />
              </IconButton>
              <IconButton color="error" onClick={() => handleDelete(product.id)}>
                <Delete />
              </IconButton>
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={9} align="center">
            No products found
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>

      {/* Modal for creating/updating a product */}
      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle>{editingProduct ? "Update Product" : "Add New Product"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Name input */}
              <Grid item xs={12}>
                <TextField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>

              {/* Qty input */}
              <Grid item xs={12}>
                <TextField
                  label="Quantity"
                  name="qty"
                  type="number"
                  value={formData.qty}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>

              {/* Description input */}
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>

              {/* Price input */}
              <Grid item xs={12}>
                <TextField
                  label="Price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>

              {/* Availability input */}
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Available</FormLabel>
                  <RadioGroup
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    row
                  >
                    <FormControlLabel value={0} control={<Radio />} label="Yes" />
                    <FormControlLabel value={1} control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {/* Product Type input */}
              <Grid item xs={12}>
                <TextField
                  label="Product Type"
                  name="productType"
                  value={formData.productType}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              {/* Image input */}
              <Grid item xs={12}>
                <TextField
                  label="Image"
                  name="image"
                  type="file"
                  inputProps={{ accept: 'image/*' }}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editingProduct ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for alerts */}
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

export default Listings;
