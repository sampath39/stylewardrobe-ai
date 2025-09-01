import { Navigation } from '@/components/Navigation';
import { AuthForms } from '@/components/AuthForms';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navigation />
      <main className="md:ml-64 p-6">
        <AuthForms />
      </main>
    </div>
  );
};

export default Profile;