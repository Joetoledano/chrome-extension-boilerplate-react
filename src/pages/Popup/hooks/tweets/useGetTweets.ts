import { useCallback, useState } from 'react';
import { tweetActions } from '../../../../lib/constants/ActionMessages';
import ExtensionMessagingHub from '../../../../messaging/';

type twitterViewType = 'tweet' | 'profile' | null;
const useGetTweets = (twitterView: twitterViewType) => {
  const [relevantTweets, setRelevantTweets] = useState<any[]>([]);
  const [relevantTweetsHTML, setRelevantTweetsHTML] = useState<any[]>([]);

  const loadInRelevantTweets = useCallback(async () => {
    if (twitterView === 'tweet') {
      try {
        const messageData = {
          action: tweetActions.loadRelevantTweets,
        };
        await ExtensionMessagingHub.sendMessage(
          'background',
          null,
          'messageFromPopup',
          messageData
        );
      } catch (error) {
        console.error(
          `Error while fetching the balance and communicating with background script: ${JSON.stringify(
            error
          )}`
        );
      }
    }
  }, [twitterView]);

  return {
    relevantTweets,
    setRelevantTweets,
    relevantTweetsHTML,
    setRelevantTweetsHTML,
    loadInRelevantTweets,
  };
};

export default useGetTweets;
