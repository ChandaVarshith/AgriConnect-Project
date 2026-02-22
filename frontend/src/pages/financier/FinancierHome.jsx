import React from 'react'
import DashboardLayout from '../../components/DashboardLayout'

// Gold coins / finance chart – matches financier reference image
const PHOTO = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80'

const FinancierHome = () => (
    <DashboardLayout
        role="financier"
        photoUrl={PHOTO}
        welcomeText="WELCOME, FINANCIER!!"
        subText="Thank you for being a vital part of the AgriConnect community. Continue managing resources, guiding users, and driving impactful decisions to support farming excellence."
    />
)

export default FinancierHome
