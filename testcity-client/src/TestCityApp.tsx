
import './assets/app.css';
import './assets/css/ui.css';

import { CloneRepoLink } from './ui/features/CloneRepoLink';
// import { MainThree2 } from './three-components/MainThree2';
import { FiltrosSec } from './ui/features/FiltrosSec';
import { MainThree } from './three-components/MainThree';

export function TestCityApp() {
  return (
    <div className='testcity'>
      <CloneRepoLink/>
      <MainThree/>
      {/* <MainThree2/> */}
      <FiltrosSec/>
    </div>
  )
}
