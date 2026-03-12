import React, { useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type User,
} from 'firebase/auth';
import { AuthContext } from './AuthContext';
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [avatar, setAvatar] = useState(0);

  useEffect(() => {
    // listen to firebase auth state changes to update userId
    const unsubscribe = auth.onAuthStateChanged(async (u: User | null) => {
      if (u) {
        setUserId(u.uid);
        const idToken = await u.getIdToken();
        setToken(idToken);

        setEmail(u.email || '');
        // fetch profile after token set
        await fetchProfile(idToken);
      } else {
        setToken('');
        setUserId(null);
        setFullName('');
        setPhone('');
        setAddress('');
        setAvatar(0);
      }
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (emailArg: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      emailArg,
      password,
    );

    const user = userCredential.user;

    const idToken = await user.getIdToken();
    setToken(idToken);

    localStorage.setItem('token', idToken);

    setUserId(user.uid);
    setEmail(emailArg);

    // const userRef = doc(db, 'users', user.uid);
    // const userSnap = await getDoc(userRef);

    // if (userSnap.exists()) {
    //   const data = userSnap.data();

    //   setFullName(data.fullName);
    //   setPhone(data.phone);
    //   setAddress(data.address);
    //   setAvatar(data.avatar);
    // }
  };
  const register = async (
    emailArg: string,
    password: string,
    fullNameArg: string,
  ) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      emailArg,
      password,
    );
    const uid = userCredential.user.uid;

    await fetch('http://localhost:5299/api/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: uid,
        fullName: fullNameArg,
        email: emailArg,
      }),
    });
  };

  const fetchProfile = async (tk?: string) => {
    const authToken = tk || token;

    console.log('=== fetchProfile start ===');
    console.log('Param token:', tk);
    console.log('State token:', token);
    console.log('Using token:', authToken);

    if (!authToken) {
      console.warn('No token available -> skip fetchProfile');
      return;
    }

    try {
      const res = await fetch('http://localhost:5299/api/user/profile', {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      console.log('Response status:', res.status);
      console.log('Response ok:', res.ok);

      if (!res.ok) {
        const text = await res.text();
        console.error('Response error body:', text);
        return;
      }

      const data = await res.json();
      console.log('Profile data:', data);

      setFullName(data.fullName ?? '');
      setEmail(data.email ?? '');
      setPhone(data.phone ?? '');
      setAddress(data.address ?? '');
      setAvatar(data.avatar ?? 0);

      console.log('Profile state updated');
    } catch (err) {
      console.error('fetchProfile error:', err);
    }

    console.log('=== fetchProfile end ===');
  };

  const updateProfile = async () => {
    if (!token) return;
    await fetch('http://localhost:5299/api/user/edit', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ fullName, email, avatar, phone, address }),
    });
  };

  const deleteAccount = async () => {
    if (!token) return;
    const ok = window.confirm(
      'Bạn có chắc muốn xóa tài khoản không? Hành động này không thể hoàn tác!',
    );
    if (!ok) return;
    const res = await fetch('http://localhost:5299/api/user/delete', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      await auth.signOut();
      setToken('');
      setUserId(null);
      alert('Tạm biệt!');
    }
  };

  const logout = async () => {
    await auth.signOut();
    setToken('');
    localStorage.removeItem('token');
    setUserId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        fullName,
        email,
        phone,
        address,
        avatar,
        login,
        register,
        logout,
        fetchProfile,
        updateProfile,
        deleteAccount,
        setFullName,
        setPhone,
        setAddress,
        setAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
