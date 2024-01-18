// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  // State for store name, selected month, and selected year 
  const [storeName, setStoreName] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  // States for populating our dropdowns
  const [vendors, setVendors] = useState([]);
  const [years, setYears] = useState([]);
  // State for storing the data fetched from the MongoDB database
  const [data, setData] = useState(null);

  //Use effect hook to populate vendor dropdown
  //TODO::We get initial warning due to the mapping we do Warning: Each child in a list should have a unique "key" prop.
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get('http://localhost:3001/getVendors');
        const vendorArray = response.data;
        setVendors(vendorArray.map(vendor => vendor));
      } catch (error) {
        // Handle error
        console.error('Error fetching vendors:', error);
      }
    };
    // Call the fetchVendors function
    fetchVendors();
  }, []);

  //Use effect hook to populate year dropdown
  useEffect(() => {

    const populateYears = () => {
      const currentYear = new Date().getFullYear();
      const startYear = 2010
      const yearOptions = [];

      for (let year = startYear; year <= currentYear; year++) {
        yearOptions.push(year);
      }

      setYears(yearOptions);
    };
    // Call the function to populate the dropdown
    populateYears();
  }, []);
  // Generate an array of all months
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  function findVendorIdByName(storeName) {
    for (const vendor of vendors) {
      if (vendor.name === storeName) {
        return vendor._id;
      }
    }
    
    return null;
  }

  // Function to handle the GET request
  const fetchData = async () => {
    try {
      const selectedVendorID = findVendorIdByName(storeName);
      const response = await axios.get('http://localhost:3001/getOrdersForVendorByMonth', {
        params: {
          storeName: storeName,
          selectedVendorID: selectedVendorID,
          orderMonth: selectedMonth,
          orderYear: selectedYear,
        },
      });
      // Update the state with the fetched data
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // useEffect to trigger the GET request when storeName or selectedMonth changes
  useEffect(() => {
    if (storeName !== '' && selectedMonth !== '' && selectedYear !== '' ) {
      fetchData();
    }
  }, [storeName, selectedMonth, selectedYear]);

  //Returned visual
  return (
    <div>
      {/* Input for store name */}
      <select
        value={storeName}
        onChange={(e) => setStoreName(e.target.value)}
      >
        <option value="">Select your store</option>
        {vendors.map((vendor) => (
          <option key={vendor.id} value={vendor.name}>
            {vendor.name}
          </option>
        ))}
      </select>
      {/* Dropdown for selecting a month */}
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      >
        <option value="">Select a month</option>
        {months.map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
      >
        <option value="">Select a year</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      {/* Display the fetched data */}
      {data && (
        <div>
          <h2>Fetched Data</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
