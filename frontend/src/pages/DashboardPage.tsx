
import { useLogout } from '../utils/auth';

const DashboardPage = () => {
  const handleLogout = useLogout();

  return (
    <div className="min-h-screen p-8 bg-blue-900 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
      <p>Welcome to your dashboard!</p>
    </div>
  );
};

export default DashboardPage;
