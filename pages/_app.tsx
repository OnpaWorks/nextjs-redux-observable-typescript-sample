import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { useRootStore } from '../stores/rootStore'

function MyApp({ Component, pageProps }: AppProps) {
    const store = useRootStore(pageProps.initialReduxState);
    return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
