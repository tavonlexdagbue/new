import React, { useState, useEffect } from 'react';

function Totals() {
  const [totals, setTotals] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/totals')
      .then(async res => {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          setTotals(data);
        } catch (e) {
          console.error('Response is not JSON:', text);
        }
      })
      .catch(err => console.error('Fetch error:', err));
  }, []);

  return (
    <div>
      <h2>Total Votes</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Party</th>
            <th>Total Votes</th>
          </tr>
        </thead>
        <tbody>
        {totals.length === 0 ? (
    <tr><td colSpan="2">Loading or no data available</td></tr>
  ) : (
    totals.map((row, index) => (
      <tr key={index}>
        <td>{row.party_abbreviation}</td>
        <td>{row.total_votes}</td>
      </tr>
    ))
  )}
        </tbody>
      </table>
    </div>
  );
}

export default Totals;
