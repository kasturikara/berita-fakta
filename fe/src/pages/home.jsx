import { useAuth } from "../context/AuthContext";

const HomePages = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Welcome to Berita Fakta</h1>
      <p className="text-xl mt-4">Hello, {user.full_name}!</p>
      <div className="mt-6">
        <h2 className="text-2xl font-semibold">Latest News</h2>
        {/* News content would go here */}
        <div className="mt-4">
          <p>No news articles available yet.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePages;
