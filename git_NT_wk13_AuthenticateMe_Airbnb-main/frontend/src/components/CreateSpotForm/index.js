import './CreateSpotForm.css'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as spotActions from '../../store/spots'
import * as spotImgActions from '../../store/spotimages'
import { useHistory } from 'react-router-dom'

// Define a functional component called CreateSpotForm
function CreateSpotForm() {
    // Define state variables for the form inputs
    const [country, setCountry] = useState('')
    const [streetAddress, setStreetAddress] = useState('')
    const [city, setCity] = useState('')
    const [addressState, setAddressState] = useState('')
    const [description, setDescription] = useState('')
    const [spotName, setSpotName] = useState('')
    const [price, setPrice] = useState('')
    const [previewImage, setPreviewImage] = useState('')
    const [imgTwo, setImgTwo] = useState('')
    const [imgThree, setImgThree] = useState('')
    const [imgFour, setImgFour] = useState('')
    const [imgFive, setImgFive] = useState('')
    const [errors, setErrors] = useState({})
    const [priceError, setPriceError] = useState('')

    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user)
    const history = useHistory()

    // Function to reset the form fields
    const reset = () => {
        setCountry('')
        setStreetAddress('')
        setCity('')
        setAddressState('')
        setDescription('')
        setSpotName('')
        setPrice('')
        setPreviewImage('')
        setImgTwo('')
        setImgThree('')
        setImgFour('')
        setImgFive('')
        setErrors({})
        setPriceError('')
    }

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault()
        setErrors({})

        // Create an array to hold the image URLs
        const spotImgs = []
        spotImgs.push({ url: previewImage, preview: true })

        // Check for additional images and add them to the array
        if(imgTwo.length > 1) spotImgs.push({ url: imgTwo, preview: false })
        if(imgThree.length > 1) spotImgs.push({ url: imgThree, preview: false })
        if(imgFour.length > 1) spotImgs.push({ url: imgFour, preview: false })
        if(imgFive.length > 1) spotImgs.push({ url: imgFive, preview: false })

        if(sessionUser) {
            // Create a new spot object
            const newSpot = {
                country: country,
                address: streetAddress,
                city: city,
                state: addressState,
                description: description,
                name: spotName,
                price: price,
                ownerId: sessionUser.id,
            }

            // Dispatch an action to create a new spot and add images to it
            dispatch(spotActions.createNewSpot(newSpot)).then( async res => {
                const spotId = res.id
                spotImgs.forEach(img => dispatch(spotImgActions.createNewImage(spotId, img)))
                reset()
                return history.push(`/spots/${spotId}`)
            })
            .catch(async res => {
                const data = await res.json()
                if(data && data.errors) {
                    setErrors(data)
                }
            })
        } else {
            // Error handling for non-logged in user
            setErrors({ user: 'You must be logged in to create a new spot!'})
        }
    }

       // Return the rendered component
       return (
        // The parent div for the create spot form
        <div id='create-spot-form-parent-div'>

            {/* Title for the form */}
            <h1 className='form-title-text'>Create a new Spot</h1>

            {/* Section header */}
            <h2 className='form-section-header-text'>Where's your place located?</h2>

            {/* Description for the form section */}
            <p className='form-section-desc-text'>Guests will only get your exact address once they book a reservation.</p>

            {/* The form itself */}
            <form id='create-new-spot-form' onSubmit={handleSubmit}>

                {/* Section for location details input */}
                <div id='form-section-one'>

                    {/* Input for country */}
                    <div id='section-one-country'>
                        <label id='country-label' htmlFor='country'>Country</label>
                    </div>
                    <div>
                        <input
                        type='text'
                        name='country'
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder='Country'
                        id='form-country-input'
                        />
                        {/* Error message for country */}
                        {errors?.errors?.country ? <p className='create-form-errors-text'>{errors?.errors?.country}</p> : ''}
                    </div>

                    {/* Input for street address */}
                    <div id='section-one-streetAddress'>
                        <label htmlFor='street-address'>Street Address</label>
                    </div>
                    <div>
                        <input
                        type='text'
                        name='street-address'
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        placeholder='Address'
                        id='form-street-address-input'
                        />
                        {/* Error message for street address */}
                        {errors?.errors?.address ? <p className='create-form-errors-text'>{errors?.errors?.address}</p> : ''}
                    </div>

                    {/* Inputs for city and state */}
                    <div id='city-and-state-parent-div'>
                        <div id='city-state-labels'>
                            <label id='city-label' htmlFor='city'>City</label>
                            <label id='state-label' htmlFor='state'>State</label>
                        </div>
                        <div id='city-state-div'>
                            {/* Input for city */}
                            <input
                            type='text'
                            name='city'
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder='City'
                            id='city-input'
                            // required
                            />
                            {/* Error message for city */}
                            {errors?.errors?.city ? <p className='create-form-errors-text'>{errors?.errors?.city}</p> : ''}
                            <span className='comma-span'> , </span>
                            {/* Input for state */}
                            <input
                            type='text'
                            name='state'
                            value={addressState}
                            onChange={(e) => setAddressState(e.target.value)}
                            placeholder='STATE'
                            id='state-input'
                            // required
                            />
                            {/* Error message for state */}
                            {errors?.errors?.state ? <p className='create-form-errors-text'>{errors?.errors?.state}</p> : ''}
                        </div>
                    </div>
                </div>

                {/* Section for spot description */}
                <div id='form-section-two'>
                    <h2 className='form-section-header-text'>Describe your place to guests</h2>
                    <p className='form-section-desc-text'>Mention the best features of your space, any specifal amenities like fast wifi or parking, and what you love about the neighborhood.</p>
                    {/* Input for description */}
                    <input
                    type='textarea'
                    placeholder='Please write at least 30 characters'
                    name='description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    id='form-description-input'
                    />
                    {/* Error message for description */}
                    {errors?.errors?.description ? <p className='create-form-errors-text'>{errors?.errors?.description}</p> : ''}
                </div>

                {/* Section for spot title */}
                <div id='form-section-three'>
                    <h2 className='form-section-header-text'>Create a title for your spot</h2>
                    <p className='form-section-desc-text'>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                    {/* Input for spot name */}
                    <input
                    type='text'
                    placeholder='Name of your spot'
                    name='name'
                    value={spotName}
                    onChange={(e) => setSpotName(e.target.value)}
                    id='spot-name-input'
                    // required
                    />
                    {/* Error message for spot name */}
                    {errors?.errors?.name ? <p className='create-form-errors-text'>{errors?.errors?.name}</p> : ''}
                </div>

                {/* Section for spot price */}
                <div id='form-section-four'>
                    <h2 className='form-section-header-text'>Set a base price for your spot</h2>
                    <p className='form-section-desc-text'>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                    {/* Input for price */}
                    $ <input
                    type='text'
                    placeholder='Price per night (USD)'
                    name='price'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    id='spot-price-input'
                    // required
                    />
                    {/* Error message for price */}
                    {errors?.errors?.price ? <p className='create-form-errors-text'>{errors?.errors?.price}</p> : ''}
                    {priceError}
                </div>

                {/* Section for spot images */}
                <div id='form-section-five'>
                    <h2 className='form-section-header-text'>Liven up your spot with photos</h2>
                    <p className='form-section-desc-text'>Submit a link to at least one photo to publish your spot.</p>
                    <div id='section-five-photo-inputs'>
                        {/* Inputs for image URLs */}
                        <div>
                            <input
                            type='url'
                            placeholder='Preview Image URL'
                            name='prev-img'
                            value={previewImage}
                            onChange={(e) => setPreviewImage(e.target.value)}
                            className='form-preview-img-input'
                            // required
                            />
                        </div>
                        <div>
                            <input
                            type='url'
                            placeholder='Image URL'
                            name='img-two'
                            value={imgTwo}
                            onChange={(e) => setImgTwo(e.target.value)}
                            className='form-img-input'
                            />
                        </div>
                        <div>
                            <input
                            type='url'
                            placeholder='Image URL'
                            name='img-three'
                            value={imgThree}
                            onChange={(e) => setImgThree(e.target.value)}
                            className='form-img-input'
                            />
                        </div>
                        <div>
                            <input
                            type='url'
                            placeholder='Image URL'
                            name='img-four'
                            value={imgFour}
                            onChange={(e) => setImgFour(e.target.value)}
                            className='form-img-input'
                            />
                        </div>
                        <div>
                            <input
                            type='url'
                            placeholder='Image URL'
                            name='img-five'
                            value={imgFive}
                            onChange={(e) => setImgFive(e.target.value)}
                            className='form-img-input'
                            id='final-img-input'
                            />
                        </div>
                    </div>
                </div>

                {/* The submit button for the form */}
                <button id='new-spot-form-submit-button' type='submit'>Create Spot</button>
            </form>
        </div>
    )
}

// Export the CreateSpotForm component
export default CreateSpotForm;
