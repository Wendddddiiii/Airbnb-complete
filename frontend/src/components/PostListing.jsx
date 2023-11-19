export const postListing = (title, address, price, thumbnail, metadata) => {
  const url = 'http://localhost:5005/listings/new';
  const userToken = localStorage.getItem('token');

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${userToken}`,
    },
    body: JSON.stringify({
      title,
      address,
      price,
      thumbnail,
      metadata,
    }),
  })
    .then((res) => {
      if (res.ok) {
        alert('Created successfully!');
        return res.json();
      } else {
        alert('Failed to create.');
      }
    });
};

export const fetchListings = () => {
  const url = 'http://localhost:5005/listings';
  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
    },
  })
    .then(res => {
      if (res.ok) {
        console.log('fetched success!');
        return res.json();
      } else {
        console.log('failed to fetch!');
      }
    })
}

export const deleteListings = (listId) => {
  const userToken = localStorage.getItem('token');
  const url = `http://localhost:5005/listings/${listId}`;
  return fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${userToken}`,

    },
  })
    .then(res => {
      if (res.ok) {
        alert('delete success!');
        return res.json();
      } else {
        alert('failed to delete!');
      }
    })
}

export const editHelper = (listId) => {
  const url = `http://localhost:5005/listings/${listId}`;
  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
    },
  })
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        alert('failed to edit!');
      }
    })
}

export const putListing = (title, address, price, thumbnail, metadata, listId) => {
  const url = `http://localhost:5005/listings/${listId}`;
  const userToken = localStorage.getItem('token');

  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${userToken}`,
    },
    body: JSON.stringify({
      title,
      address,
      price,
      thumbnail,
      metadata,
    }),
  })
    .then((res) => {
      if (res.ok) {
        alert('Edited successfully!');
        return res.json();
      } else {
        alert('Failed to edit update.');
      }
    });
}

export const publishListings = (listId, dateRanges) => {
  const userToken = localStorage.getItem('token');
  const url = `http://localhost:5005/listings/publish/${listId}`;
  const requestBody = {
    availability: dateRanges.map(range => ({
      startDate: range.startDate,
      endDate: range.endDate
    }))
  };

  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${userToken}`,

    },
    body: JSON.stringify(requestBody)
  })
    .then(res => {
      if (res.ok) {
        alert('published success!');
        return res.json();
      } else {
        alert('failed to publish!');
      }
    })
}

export const unpublishListings = (listId) => {
  const userToken = localStorage.getItem('token');
  const url = `http://localhost:5005/listings/unpublish/${listId}`;

  return fetch(url, {
    method: 'PUT', // Assuming the method is PUT, change if needed
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${userToken}`,
    }
  })
    .then(res => {
      if (res.ok) {
        alert('Unpublished successfully!');
        return res.json();
      } else {
        alert('Failed to unpublish!');
      }
    });
}

export const fetchBookings = () => {
  const userToken = localStorage.getItem('token');
  const url = 'http://localhost:5005/bookings';
  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${userToken}`,
    },
  })
    .then(res => {
      if (res.ok) {
        console.log('fetched bookings success!');
        return res.json();
      } else {
        console.log('failed to fetch bookings!');
      }
    })
}

export const bookListing = (dateRanges, totalPrice, listId) => {
  const userToken = localStorage.getItem('token');
  const url = `http://localhost:5005/bookings/new/${listId}`;
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${userToken}`,

    },
    body: JSON.stringify({
      dateRange: dateRanges,
      totalPrice
    }),
  })
    .then(res => {
      if (res.ok) {
        console.log('Made bookings success!');
        return res.json();
      } else {
        console.log('failed to make bookings!');
        return res.text().then(text => { throw new Error(text) });
      }
    })
}

export const acceptBooking = (bookingId) => {
  const userToken = localStorage.getItem('token');
  const url = `http://localhost:5005/bookings/accept/${bookingId}`;
  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${userToken}`,

    },
  })
    .then(res => {
      if (res.ok) {
        console.log('Accept bookings success!');
        return res.json();
      } else {
        console.log('failed to accept bookings!');
        return res.text().then(text => { throw new Error(text) });
      }
    })
}

export const declineBooking = (bookingId) => {
  const userToken = localStorage.getItem('token');
  const url = `http://localhost:5005/bookings/decline/${bookingId}`;
  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${userToken}`,

    },
  })
    .then(res => {
      if (res.ok) {
        console.log('Decline bookings success!');
        return res.json();
      } else {
        console.log('failed to decline bookings!');
        return res.text().then(text => { throw new Error(text) });
      }
    })
}

export const leaveReview = (listId, bookingId, rating, comment) => {
  const userToken = localStorage.getItem('token');
  const url = `http://localhost:5005/listings/${listId}/review/${bookingId}`;
  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${userToken}`,

    },
    body: JSON.stringify({
      review: { rating, comment }
    }),
  })
    .then(res => {
      console.log('Server response:', res);
      if (res.ok) {
        alert('Review has been sent!');
        return res.json();
      } else {
        return res.text().then(text => {
          console.error('Failed to leave a review:', text);
          throw new Error(text);
        });
      }
    });
}

export const deleteBookings = (bookingId) => {
  const userToken = localStorage.getItem('token');
  const url = `http://localhost:5005/bookings/${bookingId}`;
  return fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${userToken}`,

    },
  })
    .then(res => {
      if (res.ok) {
        alert('delete bookings success!');
        return res.json();
      } else {
        alert('failed to delete booking!');
      }
    })
}
