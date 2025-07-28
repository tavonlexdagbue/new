import React, { useState, useEffect } from 'react';

function ViewResults() {
  const [units, setUnits] = useState([]);
  const [unitId, setUnitId] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/polling-units') // You can hardcode or use proxy
      .then(r => r.json())
      .then(setUnits);
  }, []);

  const fetchResults = () => {
    if (!unitId) return;
    fetch(`http://localhost:5000/polling-units/${unitId}`)
      .then(r => r.json())
      .then(data => setResults(data));
  };

  return (
    <div>
      <h2>View Polling Unit Results</h2>

      <select value={unitId} onChange={e => setUnitId(e.target.value)}>
        <option value="">Select unit</option>
        {units.map(u => (
          <option key={u.uniqueid} value={u.uniqueid}>
            {u.polling_unit_name}
          </option>
        ))}
      </select>

      <button onClick={fetchResults}>Show Results</button>

      {results.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Party</th>
              <th>Votes</th>
            </tr>
          </thead>
          <tbody>
            {results.map(r => (
              <tr key={r.party_abbreviation}>
                <td>{r.party_abbreviation}</td>
                <td>{r.party_score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ViewResults;
