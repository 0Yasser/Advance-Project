
import { Provider, useDispatch } from 'react-redux'
import '../styles/globals.css'
import store from '../reducers/store'

function MyApp({ Component, pageProps }) {
  return <Provider store={store}><Component {...pageProps} /></Provider>
}

export default MyApp
