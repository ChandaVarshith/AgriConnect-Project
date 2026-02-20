import React from 'react'
import DashboardLayout from '../../components/DashboardLayout'

// Greenhouse workers – matches expert reference image
const PHOTO = 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200&auto=format&fit=crop&q=80'

const ExpertHome = () => (
    <DashboardLayout
        role="expert"
        photoUrl={PHOTO}
        welcomeText="WELCOME, EXPERT!!"
        subText="Thank you for being a vital part of the AgriConnect community. Continue managing resources, guiding users, and driving impactful decisions to support farming excellence."
    />
)

export default ExpertHome
