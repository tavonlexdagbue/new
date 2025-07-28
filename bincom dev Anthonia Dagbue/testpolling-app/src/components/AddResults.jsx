import React, { useState, useEffect } from 'react';

function AddResults() {
  const [units, setUnits] = useState([]);
  const [unitId, setUnitId] = useState('');
  const [scores, setScores] = useState({ PDP: '', DPP: '', ACN: '' });

  // Fetch polling units for dropdown
  useEffect(() => {
    fetch('/polling-units')
      .then(res => res.json())
      .then(data => setUnits(data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const results = Object.keys(scores).map(party => ({
      party,
      score: Number(scores[party])
    }));
    fetch('/polling-units', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ polling_unit_uniqueid: unitId, results })
    })
      .then(res => res.json())
      .then(resp => alert('Results saved!'))
      .catch(err => alert('Error saving results.'));
  };

  return (
    <form onSubmit={handleSubmit}>
     <label>
  Polling Unit:
  <select
    value={unitId}
    onChange={(e) => setUnitId(e.target.value)}
    required
  >
    <option value="">Select unit</option>
    {units.map((u) => (
      <option key={u.uniqueid} value={u.uniqueid}>
        {u.polling_unit_name}
      </option>
    ))}
  </select>
</label>

      {Object.keys(scores).map(party => (
        <div key={party}>
          <label>
            {party} Votes:
            <input
              type="number"
              value={scores[party]}
              onChange={e => setScores({ ...scores, [party]: e.target.value })}
              required
            />
          </label>
        </div>
      ))}

      <button type="submit">Submit Results</button>
    </form>
  );
}

export default AddResults;