import { render } from 'preact'
import { App } from './app'
import './index.css'
import 'virtual:windi.css'
import { UserProvider } from './context/userContext'

render(<UserProvider>
         <App />
        </UserProvider>, document.getElementById('app'))
