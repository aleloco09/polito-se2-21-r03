import { Dashboard, SGDetails } from './pages';

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard, exact: true },
  { path: '/:id', name: 'Produttore', component: SGDetails, exact: true },
]

export default routes;
