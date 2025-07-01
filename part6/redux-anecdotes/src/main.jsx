import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux' // enables components to access and share the Redux store
import App from './App'
import store from './store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)