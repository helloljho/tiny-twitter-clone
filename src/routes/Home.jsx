import React, { useEffect, useState } from 'react';
import { dbService, storageService } from '../fbase';
import Tweet from '../components/Tweet';
import { v4 as uuidv4 } from 'uuid';

const Home = ({ userObj }) => {
  const [tweet, setTweet] = useState('');
  const [tweets, setTweets] = useState([]);
  const [attachment, setAttachment] = useState();

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

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      console.log(finishedEvent);
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = '';
    if (attachment !== '') {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      const res = await attachmentRef.putString(attachment, 'data_url');
      attachmentUrl = await res.ref.getDownloadURL();
    }
    const tweetObj = {
      text: tweet,
      attachmentUrl,
      createdAt: Date.now(),
      creatorId: userObj.uid,
    };
    await dbService.collection('tweet').add(tweetObj);
    setTweet('');
    setAttachment(null);
  };

  const onClearAttachment = () => setAttachment(null);

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
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Tweet" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" alt="" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
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
