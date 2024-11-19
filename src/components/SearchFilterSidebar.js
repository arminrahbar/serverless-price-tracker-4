import React, { useState } from "react";
import "./Home.css";

const SearchFilterSidebar = ({ setPriceFilter }) => {
  const [selectedRange, setSelectedRange] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const presetRanges = [
    { label: "$1-25", min: 1, max: 25 },
    { label: "$25-50", min: 25, max: 50 },
    { label: "$50-100", min: 50, max: 100 },
    { label: "$100-200", min: 100, max: 200 },
    { label: "$200-400", min: 200, max: 400 },
    { label: "$400-800", min: 400, max: 800 },
    { label: "$800-1600", min: 800, max: 1600 },
  ];

  const handlePresetSelect = (range) => {
    setSelectedRange(range); // Highlight the selected preset
    setMinPrice(""); // Clear custom range inputs
    setMaxPrice("");
    setPriceFilter({ minPrice: range.min, maxPrice: range.max }); // Apply preset filter
  };

  const handleCustomRangeChange = (min, max) => {
    setMinPrice(min);
    setMaxPrice(max);
    // Don't clear selectedRange yet; it will only clear on Apply or Clear
  };

  const handleApplyFilters = () => {
    if (minPrice && maxPrice && Number(minPrice) >= Number(maxPrice)) {
      alert("Min price must be less than Max price.");
      return;
    }
    if (minPrice && maxPrice) {
      setSelectedRange(null); // Clear the selected preset since we're applying a custom range
      setPriceFilter({ minPrice: Number(minPrice), maxPrice: Number(maxPrice) });
    }
  };

  const handleClearFilters = () => {
    setSelectedRange(null); // Clear the selected preset
    setMinPrice(""); // Clear custom range inputs
    setMaxPrice("");
    setPriceFilter({ minPrice: null, maxPrice: null }); // Reset all filters
  };

  return (
    <div className="search-filter-sidebar">
      <h3 className="search-filter-sidebar-title">Filter by Price</h3>
      <div className="search-filter-preset-ranges">
        {presetRanges.map((range, index) => (
          <div
            key={index}
            className={`search-filter-range-option ${
              selectedRange?.label === range.label ? "selected" : ""
            }`}
            onClick={() => handlePresetSelect(range)}
          >
            {range.label}
          </div>
        ))}
      </div>
      <div className="search-filter-custom-range">
        <h4 className="search-filter-custom-title">Custom Price Range</h4>
        <input
          type="number"
          placeholder="Min"
          value={minPrice}
          onChange={(e) => handleCustomRangeChange(e.target.value, maxPrice)}
          className="search-filter-input"
        />
        <input
          type="number"
          placeholder="Max"
          value={maxPrice}
          onChange={(e) => handleCustomRangeChange(minPrice, e.target.value)}
          className="search-filter-input"
        />
      </div>
      <button className="search-filter-apply-button" onClick={handleApplyFilters}>
        Apply
      </button>
      <button className="search-filter-clear-button" onClick={handleClearFilters}>
        Clear
      </button>
    </div>
  );
};

export default SearchFilterSidebar;
