const DIETARY_OPTIONS = [
  { tag: 'Vegetarian', description: 'No meat or fish. May contain dairy.' },
  { tag: 'Dairy-free', description: 'No milk or dairy ingredients.' },
]

function DietaryFilters({ selectedTags, onTagChange }) {
  return (
    <fieldset className="dietary-filters">
      <legend>Dietary preferences</legend>

      <div className="dietary-filter-card">
        {DIETARY_OPTIONS.map(({ tag, description }) => (
          <label className="dietary-filter-row" key={tag}>
            <input
              type="checkbox"
              checked={selectedTags.includes(tag)}
              onChange={() => onTagChange(tag)}
            />

            <span>
              <strong>{tag}</strong>
              <small>{description}</small>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export default DietaryFilters