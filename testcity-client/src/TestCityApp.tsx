import { MainThree } from './three-components/MainThree'

import './assets/app.css';
import './assets/css/ui.css';

import { CloneRepoLink } from './ui/features/CloneRepoLink';

export function TestCityApp() {
  return (
    <>
      <CloneRepoLink/>
      <MainThree/>
    </>
  )
}
