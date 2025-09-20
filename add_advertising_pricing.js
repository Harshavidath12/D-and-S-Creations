const fs = require('fs');

// Read the ModalForm file
let content = fs.readFileSync('frontend/src/Components/CinemaManagement/ModalForm.js', 'utf8');

// Add advertising slot pricing fields after the contact info section
const advertisingPricingFields = `
          
          <div className="form-group">
            <label>Advertisement Slot Pricing</label>
            <div className="pricing-section">
              <h5>Set base prices for advertising slots (will generate 5 slots each)</h5>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Starting Slots Base Price *</label>
                  <input
                    type="number"
                    name="advertisement_slot_pricing.starting_base_price"
                    value={formData.advertisement_slot_pricing?.starting_base_price || ''}
                    onChange={handleInputChange}
                    className={errors.starting_base_price ? 'error' : ''}
                    placeholder="e.g., 1000"
                    min="0"
                  />
                  {errors.starting_base_price && <span className="error-message">{errors.starting_base_price}</span>}
                  <small>This will create 5 starting slots with varying prices around this base</small>
                </div>
                
                <div className="form-group">
                  <label>Interval Slots Base Price *</label>
                  <input
                    type="number"
                    name="advertisement_slot_pricing.interval_base_price"
                    value={formData.advertisement_slot_pricing?.interval_base_price || ''}
                    onChange={handleInputChange}
                    className={errors.interval_base_price ? 'error' : ''}
                    placeholder="e.g., 800"
                    min="0"
                  />
                  {errors.interval_base_price && <span className="error-message">{errors.interval_base_price}</span>}
                  <small>This will create 5 interval slots with varying prices around this base</small>
                </div>
                
                <div className="form-group">
                  <label>Ending Slots Base Price *</label>
                  <input
                    type="number"
                    name="advertisement_slot_pricing.ending_base_price"
                    value={formData.advertisement_slot_pricing?.ending_base_price || ''}
                    onChange={handleInputChange}
                    className={errors.ending_base_price ? 'error' : ''}
                    placeholder="e.g., 700"
                    min="0"
                  />
                  {errors.ending_base_price && <span className="error-message">{errors.ending_base_price}</span>}
                  <small>This will create 5 ending slots with varying prices around this base</small>
                </div>
              </div>
            </div>
          </div>`;

// Insert after the contact info section
content = content.replace(
  '          <div className="form-group">\n            <label>\n              <input\n                type="checkbox"\n                name="is_active"\n                checked={formData.is_active}\n                onChange={handleInputChange}\n              />\n              Active Cinema\n            </label>\n          </div>',
  `          <div className="form-group">\n            <label>\n              <input\n                type="checkbox"\n                name="is_active"\n                checked={formData.is_active}\n                onChange={handleInputChange}\n              />\n              Active Cinema\n            </label>\n          </div>${advertisingPricingFields}`
);

// Write the file back
fs.writeFileSync('frontend/src/Components/CinemaManagement/ModalForm.js', content);

console.log('Advertising slot pricing fields added to ModalForm!');
