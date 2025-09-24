import React, { useEffect, useState } from "react";
import "./BlogArticle.css";
import apiHelper from "../../features/apiHelper";

interface Blog {
  id: number;
  title: string;
  description: string;
  image: string;
}

const BlogComponent: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const fetchBlogs = async () => {
    try {
      const blogsData = await apiHelper("get", { url: "/blogs" });
      setBlogs(blogsData.data || []);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="article-container">
      <h1 className="article-header">Blog</h1>
      <p className="article-intro">
        Explore expert insights and tips for managing your farm more efficiently.
      </p>

      <div className="article-grid">
        {blogs.length === 0 ? (
          <p>No blogs available at the moment.</p>
        ) : (
          blogs.map((blog) => (
            <article key={blog.id} className="article-card">
              <img
                src={`/${blog.image}`}
                alt={blog.title}
                className="article-image"
              />
              <div className="article-content">
                <h2 className="article-title">{blog.title}</h2>
                <p className="article-description">{blog.description}</p>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogComponent;
