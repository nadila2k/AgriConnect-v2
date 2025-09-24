import "./ContactForm.css";

const ContactForm = () => {
  return (
    <div className="contact-form-container">
      <div className="contact-form-content">
        <h2>Contact Us</h2>
        <form>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" placeholder="Your Name" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Your Email" />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              rows={4}
              placeholder="Your Message"
            ></textarea>
          </div>
          <button type="submit" className="submit-button">
            Send Message
          </button>
        </form>
      </div>
      <img
        src="https://media.beehiiv.com/cdn-cgi/image/fit=scale-down,format=auto,onerror=redirect,quality=80/uploads/asset/file/f16c4b5c-d439-4b1f-b81c-8ab426673378/f3b719e9-e3c6-4851-8d64-8f7e7dfaac88_1792x1024.jpg?t=1716722272"
        alt="Contact"
        className="contact-form-image"
      />
    </div>
  );
};

export default ContactForm;
