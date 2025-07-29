import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import Banner from '../components/Banner'
import TopDoctors from '../components/TopDoctors'

const home = () => {
  return (
    <div>
      <div>
        <Header/>
        <SpecialityMenu/>
        <TopDoctors/>
        <Banner/>
      </div>
    </div>
  )
}

export default home
