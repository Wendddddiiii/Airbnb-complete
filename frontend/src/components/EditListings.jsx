import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { editHelper, putListing } from './PostListing';
import { fileToDataUrl } from './ShowAllListings';

const EditListings = () => {
  const { listId } = useParams();
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
  useEffect(() => {
    editHelper(listId)
      .then(res => {
        const listing = res.listing;
        setTitle(listing.title);
        setAddress(listing.address);
        setPrice(listing.price);
        setType(listing.metadata.type);
        setThumbnailDataUrl(listing.thumbnail);
        setNumBathroom(listing.metadata.numBathroom);
        setNumBed(listing.metadata.numBed);
        setNumBedrooms(listing.metadata.numBedrooms);
        setAmenities(listing.metadata.amenities);
      })
  }, []);
  return (
    <div><br />
      Title:<input type ="text" name="title" onChange={e => setTitle(e.target.value) } value={title} style={{ flex: '1', margin: '5px' }} /><br />
      Address:<input type ="text" onChange={e => setAddress(e.target.value) } value={address} style={{ flex: '1', margin: '5px' }} /><br />
      Price(per night):<input type ="text" onChange={e => setPrice(e.target.value) } value={price} style={{ flex: '1', margin: '5px' }} /><br />
      Property Type:<input type ="text" onChange={e => setType(e.target.value) } value={type} style={{ flex: '1', margin: '5px' }}/><br />
      New Thumbnail:
      <input type='file' name="thumbnail" onChange={async (e) => {
        try {
          const dataUrl = await fileToDataUrl(e.target.files[0]);
          setThumbnailDataUrl(dataUrl);
        } catch (error) {
          console.error(error);
        }
      }} /><br />
      Number of Bathrooms:<input type ="text" onChange={e => setNumBathroom(e.target.value) } value={numBathroom} style={{ flex: '1', margin: '5px' }}/><br />
      Number of Bedrooms:<input type ="text" onChange={e => setNumBedrooms(e.target.value) } value={numBedrooms} style={{ flex: '1', margin: '5px' }} /><br />
      Number of Beds:<input type ="text" onChange={e => setNumBed(e.target.value) } value={numBed} style={{ flex: '1', margin: '5px' }}/><br />
      Property amenities<input type ="text" onChange={e => setAmenities(e.target.value) } value={amenities} style={{ flex: '1', margin: '5px' }} /><br />
      <button onClick={e => {
        putListing(title, address, price, thumbnail, { type, numBathroom, numBed, numBedrooms, amenities }, listId)
        navigate('/dashboard')
      }} type="button" className="btn btn-warning">Submit</button>
      <button onClick={e => navigate('/showAllListing')} type="button" className="btn btn-warning">Cancel</button>

    </div>
  );
}

export default EditListings;
