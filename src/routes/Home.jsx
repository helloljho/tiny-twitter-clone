import React, { useEffect, useState } from 'react';
import { dbService } from '../fbase';
import Tweet from '../components/Tweet';

const Home = ({ userObj }) => {
  const [tweet, setTweet] = useState('');
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    dbService.collection('tweet').onSnapshot((snapshot) => {
      const tweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTweets(tweetArray);
    });
  }, []);

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setTweet(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.collection('tweet').add({
      text: tweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
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
      <div>
        {tweets &&
          tweets.map((tweet) => (
            <Tweet
              key={tweet.id}
              tweetObj={tweet}
              isOwner={tweet.creatorId === userObj.uid}
            />
          ))}
      </div>
    </div>
  );
};

export default Home;
