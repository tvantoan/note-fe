import React from 'react';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const {
    fullName,
    email,
    phone,
    address,
    avatar,
    setFullName,
    setPhone,
    setAddress,
    setAvatar,
    updateProfile,
    deleteAccount,
  } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile();
      alert('Hồ sơ đã được cập nhật thành công!');
      navigate('/notes');
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi cập nhật hồ sơ');
    }
  };
  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">User Profile</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p>Avatar</p>
            <div className="flex gap-2 mt-2">
              {[0, 1, 2].map((num) => (
                <img
                  key={num}
                  src={`/avatars/${num + 1}.png`}
                  alt={`Avatar ${num + 1}`}
                  className={`w-12 h-12 rounded-full cursor-pointer border-2 ${avatar === num ? 'border-blue-500' : 'border-transparent'}`}
                  onClick={() => setAvatar(num)}
                />
              ))}
            </div>
          </div>

          <form className="space-y-3" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold">Full Name</label>
              <input
                className="w-full border rounded-md p-2"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold">Email</label>
              <input
                className="w-full border rounded-md p-2 bg-gray-100"
                value={email}
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-semibold">Phone</label>
              <input
                className="w-full border rounded-md p-2"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold">Address</label>
              <input
                className="w-full border rounded-md p-2"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                Update Profile
              </button>
              <button
                onClick={deleteAccount}
                className="bg-red-600 text-white py-2 px-4 rounded-lg"
              >
                Delete Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
