import React from "react";
import Layout from "./Layout"; // Import the common Layout component for header and page structure
import "./Home.css"; // Use the same CSS styles for consistency

function LearnMore() {
  return (
    <Layout>
      <div className="learn-more-container">
        <h1>How Savr Works</h1>
        <p>
          It is important to us that you feel safe when you compare prices of a product you might be interested to buy or use any of our other services. Therefore, we are providing you with certain information about how our product search results (including product rankings) work.
        </p>

        <h2>Who are we?</h2>
        <p>
          We are the Savr Group, and our platform provides you services such as product price tracking, comparison across vendors, and notifications on price updates. Our goal is to simplify your shopping experience by ensuring you get the best deal. In this page, we are providing you with more information on how we rank our search results and how our search functionalities work.
        </p>

        <h2>How do we rank products?</h2>
        <p>
          Products are ranked based on a combination of relevance, price, availability, and user preference. Savr uses various factors to ensure that you can easily find what you are looking for, while also keeping track of any price changes for your selected products.
        </p>

        <h2>Product Updates and Notifications</h2>
        <p>
          Our product update system notifies you whenever a price change occurs for a product in your tracking list. We also allow you to manually search for price changes, which is useful when you want to verify if a better deal is available.
        </p>

        <h2>User Experience and Feedback</h2>
        <p>
          We continuously strive to improve Savr based on user feedback. If you have any suggestions or encounter issues, please feel free to reach out to us. Your experience is our priority.
        </p>

        <p>
          Thank you for choosing Savr! <br />We hope our platform helps you save time and money.
        </p>
      </div>
    </Layout>
  );
}

export default LearnMore;
