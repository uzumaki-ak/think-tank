import React from 'react'
import MainLayout from '../../components/MainLayout'
import Hero from './container/Hero'
import Articles from './container/Articles'
import Newsletter from '../../components/Newsletter'

const HomePage = () => {
  return (
    <div>
      <MainLayout>
        <Hero />
        <Articles />
        <Newsletter />
      </MainLayout>
    </div>
  )
}

export default HomePage
