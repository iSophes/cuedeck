import { render } from 'solid-js/web'
import App from './App'
import './index.css'

document.documentElement.dataset.platform = window.cuedeck.platform

render(() => <App />, document.getElementById('root')!)
