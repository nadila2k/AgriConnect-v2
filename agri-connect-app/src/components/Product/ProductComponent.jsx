import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiHelper from "../../features/apiHelper.js";
import "./ProductComponent.css"; // Import the CSS file
import { useSelector } from "react-redux";
import { selectUser } from "../../features/slices/authSlice.js";
import { Button } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

const ProductComponent = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const user = useSelector(selectUser);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await apiHelper("get", { url: `/product/` });
        const mappedProducts = productsData.data.map((product) => {
          let category = "Other";
          if (product.user.role === 1) category = "Wholesale";
          if (product.user.role === 2) category = "Fertilizer";
          if (product.user.role === 3) category = "Machinery";

          return {
            id: product.id,
            name: product.name,
            image: product.image,
            description: product.description,
            category,
            price: product.price,
            qty: product.qty,
            user: {
              userId: product.user.userId,
              email: product.user.email,
              district: product.user.district,
              phoneNumber: product.user.phoneNumber,
            },
            productType: product.productType,
          };
        });
        setProducts(mappedProducts);
        setFilteredProducts(mappedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    filterProducts(searchQuery, category);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    filterProducts(query, selectedCategory);
  };

  const filterProducts = (query, category) => {
    let filtered = products;

    // Filter by category
    if (category !== "All") {
      filtered = filtered.filter((product) => product.category === category);
    }

    // Filter by name, description, and category
    if (query) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <section className="product-section">
      <div className="title-container">
        <h2 className="product-title">Our Products</h2>
        <p className="product-subtitle">
          Explore our range of essential agricultural products.
        </p>
        {/* Search Bar */}
        <input
          type="text"
          className="search-bar"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <div className="category-buttons">
        <button
          className={`category-button ${
            selectedCategory === "All" ? "active" : ""
          }`}
          onClick={() => handleCategoryClick("All")}
        >
          All
        </button>
        <button
          className={`category-button ${
            selectedCategory === "Fertilizer" ? "active" : ""
          }`}
          onClick={() => handleCategoryClick("Fertilizer")}
        >
          Fertilizer
        </button>
        <button
          className={`category-button ${
            selectedCategory === "Wholesale" ? "active" : ""
          }`}
          onClick={() => handleCategoryClick("Wholesale")}
        >
          Wholesale
        </button>
        <button
          className={`category-button ${
            selectedCategory === "Machinery" ? "active" : ""
          }`}
          onClick={() => handleCategoryClick("Machinery")}
        >
          Machinery
        </button>
      </div>
      <div className="product-content">
        {filteredProducts.map((product) => (
          <div className="product-card" key={product.id}>
            <div onClick={() => handleProductClick(product.id)}>
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">Price: Rs.{product.price}</p>
              <p className="product-quantity">
                {" "}
                Quantity: {product.qty}{" "}
                {product.category === "Wholesale" ? "kg" : ""}
              </p>
              <p className="product-description">{product.description}</p>
            </div>
            {user.id !== product.user.userId && (
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
        ))}
      </div>
    </section>
  );
};

export default ProductComponent;
