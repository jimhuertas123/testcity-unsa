import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { TestCityApp } from './TestCityApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TestCityApp />
  </StrictMode>,
)
