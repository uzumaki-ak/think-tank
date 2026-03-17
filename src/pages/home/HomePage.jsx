import React from 'react'
import MainLayout from '../../components/MainLayout.jsx'
import Hero from './container/Hero.jsx'
import Articles from './container/Articles.jsx'
import CTA from './container/CTA.jsx'

const HomePage = () => {
  return (
    <div>
      <MainLayout>
        <Hero />
        <Articles />
        <CTA />
      </MainLayout>
    </div>
  )
}

export default HomePage
