import React from 'react';
import './StockScreen.css';
import StockDashboard from './../../components/StockDashboard/StockDashboard';
import NavigationModule from './../../components/NavigationModule/NavigationModule';
import { SCREENS } from './../../common/constants';

function HomeScreen() {
  return (
    <div className='screen'>
      <NavigationModule displayTitle={SCREENS.STOCK}/>
      <StockDashboard displayTitle={SCREENS.STOCK}/>
    </div>
  );
}

export default HomeScreen;
