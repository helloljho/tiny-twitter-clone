import React, { useState } from 'react';
import { dbService } from '../fbase';

const Home = () => {
  const [tweet, setTweet] = useState('');
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setTweet(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.collection('tweet').add({
      tweet,
      createdAt: Date.now(),
    });
    setTweet('');
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="what's on your mind?"
          onChange={onChange}
          maxLength={120}
          value={tweet}
        />
        <input type="submit" value="Tweet" />
      </form>
    </div>
  );
};

export default Home;
