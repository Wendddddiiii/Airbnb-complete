import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postListing } from './PostListing';
import { fileToDataUrl } from './ShowAllListings';

const CreateListing = () => {
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('');
  const [thumbnail, setThumbnailDataUrl] = useState('');
  const [numBathroom, setNumBathroom] = useState(0);
  const [numBed, setNumBed] = useState(0);
  const [numBedrooms, setNumBedrooms] = useState(0);
  const [amenities, setAmenities] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const validateForm = () => {
    if (!title || !address || !price || !type || !thumbnail) {
      return 'Please fill out all required fields.';
    }
    if (isNaN(price) || isNaN(numBathroom) || isNaN(numBedrooms) || isNaN(numBed)) {
      return 'Price, number of bathrooms, bedrooms, and beds must ALL be numbers.';
    }
    return '';
  };
  const handleSubmit = async () => {
    const errorMessage = validateForm();
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    try {
      await postListing(title, address, price, thumbnail, { type, numBathroom, numBedrooms, numBed, amenities });
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      setError('Failed to create listing. Please try again.');
    }
  };
  return (
    <div>
      <label>
        Title:<input type ="text" name="title" onChange={e => setTitle(e.target.value) } style={{ flex: '1', margin: '5px' }} />
      </label><br />
      <label>
        Address:<input type ="text" name="address"onChange={e => setAddress(e.target.value) } style={{ flex: '1', margin: '5px' }} />
      </label><br />
      <label>
        Price(per night):<input type ="text" name="price" onChange={e => setPrice(e.target.value) } style={{ flex: '1', margin: '5px' }} />
      </label><br />
      <label>
        Property Type:<input type ="text" name="propertyType" onChange={e => setType(e.target.value) } style={{ flex: '1', margin: '5px' }} />
      </label><br />
      <label>
        Thumbnail:
        <input type='file' name="thumbnail" onChange={async (e) => {
          try {
            const dataUrl = await fileToDataUrl(e.target.files[0]);
            setThumbnailDataUrl(dataUrl);
          } catch (error) {
            console.error(error);
          }
        }} />
      </label><br />
      <label>
        Number of Bathrooms:<input type ="text" name="bathrooms" onChange={e => setNumBathroom(e.target.value) } style={{ flex: '1', margin: '5px' }} />
      </label><br />
      <label>
        Number of Bedrooms:<input type ="text" name="bedrooms" onChange={e => setNumBedrooms(e.target.value) } style={{ flex: '1', margin: '5px' }} />
      </label><br />
      <label>
        Number of Beds:<input type ="text" onChange={e => setNumBed(e.target.value) } style={{ flex: '1', margin: '5px' }} /><br />
      </label><br />
      <label>
        Property amenities<input type ="text" name="amenities" onChange={e => setAmenities(e.target.value) } style={{ flex: '1', margin: '5px' }} /><br />
      </label><br />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleSubmit} type="submit" className="btn btn-warning">Submit</button>
      <button onClick={e => navigate('/dashboard')} type="button" className="btn btn-warning">Cancel</button>
    </div>
  );
}

export default CreateListing;
