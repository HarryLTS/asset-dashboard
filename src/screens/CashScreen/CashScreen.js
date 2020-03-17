import React from 'react';
import CashDashboard from './../../components/CashDashboard/CashDashboard';
import NavigationModule from './../../components/NavigationModule/NavigationModule';
import { SCREENS } from './../../common/constants';

function CashScreen() {
  return (
    <div className='screen'>
      <NavigationModule displayTitle={SCREENS.CASH}/>
      <CashDashboard displayTitle={SCREENS.CASH}/>
    </div>
  );
}

export default CashScreen;
