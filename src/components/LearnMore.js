import React from "react";
import Layout from "./Layout"; // Import the common Layout component for header and page structure
import "./Home.css"; // Use the same CSS styles for consistency

function LearnMore() {
  return (
    <Layout>
      <div className="learn-more-container" style={{ marginTop: '70px'}}>
      
        <h1>How Savr Works</h1>
        <p>
          It is important to us that you feel safe when you compare prices of a
          product you might be interested to buy or use any of our other
          services. Therefore, we are providing you with certain information
          about how to use Savr.
        </p>

        <h2>How to add and remove a product from tracking</h2>

        <p>
          On home page, click on "Add Product" to add a new product to your
          price tracking list. To remove a product, you can click on "Remove
          Product" to remove a product from tracking. The tracked products on
          home display the the products whose price you are interested to track
          or are tracking across various websites.
        </p>

        <h2>How to add and remove a vendor from tracking</h2>
        <p>
          On product details page for a given product, you can add new vendors to track their prices for the current product.
          To add a new vendor, click on "Add Vendor" which takes you to a page where you can select new vendors. 
          To remove an existing vendor, click on "Remove Vendor" to remove. 
        </p>

        <h2>Product Updates and Notifications</h2>
        <p>
          Our product update system notifies you whenever a price change occurs
          for a product in your tracking list. On the home page, a notification appears
          to the left of a product if a vendor's price for that item has changed since 
          user last viewed the product details page for that product. 
        </p>

        <p>
          Thank you for choosing Savr! <br />
          We hope our platform helps you save time and money.
        </p>
      </div>
    </Layout>
  );
}

export default LearnMore;