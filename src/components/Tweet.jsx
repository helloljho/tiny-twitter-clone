import React, { useState } from 'react';
import { dbService } from '../fbase';

const Tweet = ({ tweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);

  const onDeleteClick = async () => {
    const ok = window.confirm('Are you sure you want to delete this tweet?');
    if (ok) {
      await dbService.doc(`tweet/${tweetObj.id}`).delete();
    }
  };

  const toggleEditing = () => setEditing((prev) => !prev);
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewTweet(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`tweet/${tweetObj.id}`).update({
      text: newTweet,
    });
    setEditing(false);
  };

  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Edit your tweet"
              value={newTweet}
              onChange={onChange}
              required
            />
            <input type="submit" value="Update Tweet" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{tweetObj.text}</h4>
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete</button>
              <button onClick={toggleEditing}>Edit</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Tweet;
