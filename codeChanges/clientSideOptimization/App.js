// Before: Eager loading all components
/*
import ProductCatalog from './components/ProductCatalog';
import UserDashboard from './components/UserDashboard';
import AdminPanel from './components/AdminPanel';
import Analytics from './components/Analytics';
*/

// After: Lazy loading with React.lazy()
const ProductCatalog = React.lazy(() => import('./components/ProductCatalog'));
const UserDashboard = React.lazy(() => import('./components/UserDashboard'));
const AdminPanel = React.lazy(() => import('./components/AdminPanel'));
const Analytics = React.lazy(() => import('./components/Analytics'));

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/products" element={<ProductCatalog />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Suspense>
    </Router>
  );
}