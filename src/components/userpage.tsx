import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const Userpage = ({ user }: { user: any }) => {
  const [profile, setProfile] = useState({
    bio: '',
    dp: '', // base64 image
  });

  useEffect(() => {
    const saved = localStorage.getItem(`profile_${user.email}`);
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, [user.email]);

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile(prev => ({ ...prev, dp: reader.result as string }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleSave = () => {
    localStorage.setItem(`profile_${user.email}`, JSON.stringify(profile));
    alert('Profile saved!');
  };

  return (
    <div className="w-full max-w-md space-y-4 p-4 border rounded shadow">
      <h2 className="text-xl font-semibold">Complete Your Profile</h2>

      {profile.dp && (
        <div className="flex justify-center">
          <img src={profile.dp} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
        </div>
      )}

      <div className="space-y-2">
        <Label>Display Picture</Label>
        <Input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>

      <div className="space-y-2">
        <Label>Bio</Label>
        <Input
          type="text"
          placeholder="Tell us about yourself"
          value={profile.bio}
          onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
        />
      </div>

      <Button onClick={handleSave}>Save Profile</Button>
    </div>
  );
};
export default Userpage