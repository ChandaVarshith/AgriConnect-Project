import React from 'react'
import DashboardLayout from '../../components/DashboardLayout'

// Farmer with cattle silhouette at sunset – matches reference image
const PHOTO = 'https://images.unsplash.com/photo-1509099863731-ef4bff19e808?w=1200&auto=format&fit=crop&q=80'

const FarmerHome = () => (
    <DashboardLayout
        role="farmer"
        photoUrl={PHOTO}
        welcomeText="WELCOME, FARMER!!"
        subText="Thank you for being an essential part of the AgriConnect community. Continue utilizing our platform, sharing your experiences, and making informed choices to enhance your farming practices."
    />
)

export default FarmerHome
