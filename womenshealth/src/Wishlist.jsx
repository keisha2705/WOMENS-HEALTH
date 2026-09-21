import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PRODUCT_CATALOG } from "./products";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Wishlist.css";

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [notesState, setNotesState] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchWishlist() {
      const storedToken = localStorage.getItem("authToken");

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/wishlist`, {
          method: "GET",
          headers: {
            Authorization: `Basic ${storedToken}`, 
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const dbProductIds = await res.json(); 

          console.log(
            "Raw Wishlist Array data received from MongoDB Atlas:",
            dbProductIds,
          );

          if (Array.isArray(dbProductIds) && dbProductIds.length > 0) {
            const cleanDbIds = dbProductIds.map((id) => String(id).trim());

            const matchedProducts = PRODUCT_CATALOG.filter((catalogItem) => {
              const catalogId = String(
                catalogItem.id || catalogItem._id || "",
              ).trim();
              return cleanDbIds.includes(catalogId);
            });

            console.log(
              "Successfully matched catalog products count:",
              matchedProducts.length,
            );

            if (matchedProducts.length > 0) {
              setWishlistItems(matchedProducts);
              setLoading(false);
              return;
            }
          }
        }
        const savedWishlist =
          JSON.parse(localStorage.getItem("userWishlist")) || [];
        setWishlistItems(savedWishlist);
      } catch (err) {
        console.error(
          "MongoDB fetch check failure recovery mode activated:",
          err,
        );
        const savedWishlist =
          JSON.parse(localStorage.getItem("userWishlist")) || [];
        setWishlistItems(savedWishlist);
      } finally {
        setLoading(false);
      }
    }
    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = async (productId) => {
    const storedToken = localStorage.getItem("authToken");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/wishlist/remove`, {
        method: "DELETE", // Hits your exact deletion endpoint route
        headers: {
          Authorization: `Basic ${storedToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: productId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to remove item.");
      }

      // Success: Drops the card from the screen array layout instantly
      setWishlistItems(
        wishlistItems.filter((item) => (item.id || item._id) !== productId),
      );
      alert(
        data.message ||
          "Product successfully removed from your database wishlist.",
      );
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleSaveNotes = async (productId) => {
    const storedToken = localStorage.getItem("authToken");
    const userNotes = notesState[productId] || "";

    try {
      const res = await fetch("http://32.198.180", {

        headers: {
          Authorization: storedToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productId,
          userNotes: userNotes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update notes.");
      }

      alert(data.message || "Wishlist shopping notes updated successfully.");
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    }
  };

  // Handle local text changes inside notes boxes before user hits save
  const handleNotesTextChange = (productId, text) => {
    setNotesState((prev) => ({
      ...prev,
      [productId]: text,
    }));
  };

  if (loading) {
    return (
      <div
        className="homepage"
        style={{ padding: "4rem", textAlign: "center" }}
      >
        Reading your secure saved wishlist configurations...
      </div>
    );
  }

  return (
    <main className="homepage">
      <div className="homepage-container">
        <Navbar />

        <header className="page-section-header">
          <span className="hero-tagline">Your Saved Preferences</span>
          <h1 className="homepage-hero-title">My Product Wishlist</h1>
          <p className="homepage-hero-description">
            Objective configurations synced securely to your medical cluster
            database. Edit inline clinic consultation notes directly underneath
            your selections.
          </p>
        </header>

        {wishlistItems.length === 0 ? (
          <div className="empty-wishlist-view">
            <div className="empty-wishlist-icon"></div>
            <h3>Your wishlist is empty</h3>
            <p>
              You haven't saved any health products to your curation hub yet.
            </p>
            <Link to="/products" className="hero-btn-primary">
              Browse Health Catalog
            </Link>
          </div>
        ) : (
          <>
            <div className="wishlist-toolbar">
              <span className="wishlist-counter-text">
                <strong>{wishlistItems.length}</strong> saved products
              </span>
            </div>

            <div className="wishlist-items-stack">
              {wishlistItems.map((product) => {
                const dbId = product._id || product.id;
                const displayName =
                  product.name || product.label || "Unnamed Product";
                const displayDesc =
                  product.description ||
                  product.desc ||
                  "No description text uploaded.";
                const displayPrice =
                  product.priceNote ||
                  product.saPricing ||
                  "Price on consultation";
                const displayImage =
                  product.image || product.imgSrc || "/WhImages/wh30.jpg";

                return (
                  <div
                    key={dbId}
                    className="wishlist-item-card backend-card-height"
                  >
                    <div className="wishlist-item-image-box">
                      <img src={displayImage} alt={displayName} />
                    </div>

                    <div className="wishlist-item-details-box">
                      <div className="wishlist-item-header-meta">
                        <span className="product-category-tag">
                          {product.category || "Health Care"}
                        </span>
                        <h3 className="wishlist-item-title">{displayName}</h3>
                        <span className="wishlist-item-price-tag">
                          {displayPrice}
                        </span>
                        <p
                          className="wishlist-item-snippet"
                          style={{ marginTop: "0.5rem" }}
                        >
                          {displayDesc}
                        </p>
                      </div>

                      <div className="wishlist-notes-inline-box">
                        <label htmlFor={`notes-${dbId}`}>
                          Gynaecologist Discussion Notes:
                        </label>
                        <div className="notes-input-action-wrapper">
                          <input
                            id={`notes-${dbId}`}
                            type="text"
                            placeholder="Add custom symptoms or notes for your doctor checking this product..."
                            value={notesState[dbId] || ""}
                            onChange={(e) =>
                              handleNotesTextChange(dbId, e.target.value)
                            }
                          />
                          <button
                            type="button"
                            className="save-notes-inline-btn"
                            onClick={() => handleSaveNotes(dbId)}
                          >
                            Save Notes
                          </button>
                        </div>
                      </div>

                      <div className="wishlist-item-actions-row">
                        <div className="wishlist-buttons-group">
                          <Link
                            to="/products"
                            className="view-product-anchor-link"
                          >
                            View Deep-Dive Analysis →
                          </Link>
                  
                          <button
                            type="button"
                            className="remove-wishlist-item-btn"
                            onClick={() => handleRemoveFromWishlist(product.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
      <Footer />
    </main>
  );
}
