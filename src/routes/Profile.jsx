import React, { useEffect, useState } from 'react';
import { authService, dbService } from '../fbase';
import { useHistory } from 'react-router-dom';

const Profile = ({ refreshUser, userObj }) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const onLogoutClick = () => {
    authService.signOut();
    history.push('/');
  };

  const getMyTweet = async () => {
    const tweet = await dbService
      .collection('tweet')
      .where('creatorId', '==', userObj.uid)
      .orderBy('createdAt')
      .get();

    console.log(tweet.docs.map((doc) => doc.data()));
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({ displayName: newDisplayName });
      refreshUser();
    }
  };

  useEffect(() => {
    getMyTweet();
  }, []);
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Display name"
          onChange={onChange}
          value={newDisplayName}
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogoutClick}>Log Out</button>
    </>
  );
};

export default Profile;
