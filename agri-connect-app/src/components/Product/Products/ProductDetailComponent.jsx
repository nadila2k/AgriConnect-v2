import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import apiHelper from "../../../features/apiHelper";
import "./ProductDetailComponent.css"; // Import the CSS file
import { Button } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/slices/authSlice";


const ProductDetailComponent = () => {
  const { id } = useParams(); // Get the product ID from the URL parameters
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await apiHelper("get", { url: `/product/${id}` });
        console.log(response.data); // Log the product data
        if (response.success) {
          setProduct(response.data);
        } else {
          console.error("Failed to fetch product details");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!product) {
    return <div className="product-not-found">Product not found.</div>;
  }

  // console.log(product);

  return (
    <div className="product-detail">
      <img
        src={`http://localhost:5001/${product.image}`}
        alt={product.name}
        className="product-detail-image"
      />
      <h2 className="product-detail-name">{product.name}</h2>
      <p className="product-detail-description">{product.description}</p>
      <div className="product-detail-info">
        <p className="product-detail-price">
          Price: <span>Rs.{product.price}</span>
        </p>
        <p className="product-detail-quantity">
          Quantity: <span>{product.qty}</span>
        </p>
        <p className="product-detail-email">
          Email: <span>{product.user.email}</span>
        </p>
        <p className="product-detail-district">
          District: <span>{product.user.district}</span>
        </p>
        <p className="product-detail-phone">
          Phone: <span>{product.user.phoneNumber}</span>
        </p>
        {user.id !== product.user.userId &&  (
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ChatBubbleOutlineIcon />}
            onClick={() =>
              navigate(`/chat/${product.user.userId}/${product.user.email}`)
            }
            sx={{
              textTransform: "none",
              borderRadius: "12px",
              padding: "6px 12px",
              fontWeight: "500",
              "&:hover": {
                backgroundColor: "#e3f2fd",
              },
            }}
          >
            Chat
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductDetailComponent;
