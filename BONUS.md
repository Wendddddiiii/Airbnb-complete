1. in 2.3.2 filter, the function of handleSearch allows each filter to be applied to the result of the previous filters, allowing them to combine effectively, for example, you can type in keyword first and then choose a price range. which is more advanced than the request that "You are only required to be able to search by one of the parameters described below at a time".

2. Use the last url from backend to successfully implement deleting a booking if it has NOT been 'accepted'.

3. When create a new listing, use validateForm to check if all required fields (title, address, price, type, thumbnail) are filled out and ensures that price, numBathroom, numBedrooms, and numBed are numbers.
   An error state is used to store and display error messages.
   handleSubmit calls validateForm before attempting to submit. If validation fails, it sets the error message and stops further execution.
   An error message is displayed under the form inputs if any validation errors occur.

4. When the user search by filtering all listings by dates, there will be popup error
   showing that they need to choose a start date that is earlier than the end date.

5. When a host wants to publish his/her listings, error popup is implemented for choosing at lease one valid
   date range to publish to the public before submit.

6. Same as point3, When another user wants to make a booking for a listing, he/she should choose at lease one valid date range to book before submit.

7. designed a lovely logo, which enriches the user experience
