import "./Sector.css";

const AboutUs = () => {
  return (
    <section className="about-us">
      <h2 className="section-title">Our Vision and Mission</h2>
      <div className="about-us-content">
        {/* Vision */}
        <div className="about-us-card">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1DzqFJ-uX4N9Hm1AO-o88YUgG40sl6WPJTg&s"
            alt="Vision"
            className="round-image"
          />
          <div className="card-content">
            <h3>Vision</h3>
            <p>
              AgriConnect envisions a future where Sri Lanka’s agriculture is
              modernized, sustainable, and digitally empowered. We aspire to
              create a thriving agricultural ecosystem where farmers, vendors,
              buyers, and government bodies collaborate seamlessly, leading to
              improved food security, stronger rural livelihoods, and a more
              resilient agricultural economy.
            </p>
          </div>
        </div>

        {/* Mission */}
        <div className="about-us-card mission">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2917/2917995.png"
            alt="Mission"
            className="round-image"
          />
          <div className="card-content">
            <h3>Mission</h3>
            <p>
              Our mission is to empower all stakeholders in Sri Lanka’s
              agricultural sector through a centralized digital platform. By
              offering crop forecasting, price prediction, a digital marketplace,
              real-time communication, and government dashboards, AgriConnect
              bridges gaps in information, promotes transparency, and leverages
              technology to drive sustainable growth.
            </p>
          </div>
        </div>

        {/* Importance / Core Objective */}
        <div className="about-us-card">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2553/2553620.png"
            alt="Objectives"
            className="round-image"
          />
          <div className="card-content">
            <h3>Our Core Objectives</h3>
            <p>
              AgriConnect aims to improve farmer decision-making, enhance market
              transparency, provide government enablement with real-time data,
              and promote resilience against climate change. Our platform is
              built with scalability, accessibility, and inclusivity at its
              heart, ensuring long-term impact for Sri Lanka’s farming
              communities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
