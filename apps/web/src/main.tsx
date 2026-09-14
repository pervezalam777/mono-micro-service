import React, {useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App';
import { fetchMe } from './store/authSlice';

function AppWithAuth() {
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      store.dispatch(fetchMe());
    }
  }, []);

  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppWithAuth />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
