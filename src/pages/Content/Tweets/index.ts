import { tweetActions } from '../../../lib/constants/ActionMessages';
import {
  getTokensDataObjectByName,
  getTokensDataObjectBySymbol,
  removeSpecialCharacters,
} from '../../../lib/helpers';
import ExtensionMessagingHub from '../../../messaging';
import { AddBalancesToElement } from '../AddBalancesToElement';
type TweetType = {
  text: string;
  username: string;
  handle: string;
  imageUrl: string;
  timestamp: string; // Consider using a Date if you have timestamps as datetime strings
  likes: number;
  replies: number;
  retweets: number;
};

// TODOS:
//      1. Add function to detect scrolls and message sending to poprelevantTweetsTwitterDataup for relevant tweets, and sending relevant tweets info to popup
//      2. Add listener to get back balances and address info for relevant tweets from popup
//         a. Within listener add back function to render tweets info onto tweet
export class TweetEnhancer {
  private tweets: HTMLElement[] | null;
  private interval: any;

  // Sends responses for messages from background/popup
  private handleMessageFromPopup = (
    message: { type: string; data: { action: string; payload?: any } },
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => {
    if (message.type) {
      // Extracting requested data

      // TODO: Fetch and prepare actual data here
      const { action, payload } = message.data;
      switch (action) {
        case tweetActions.setTwitterView:
          const twitterViewResponse = {
            twitterView: 'tweet',
            messageAction: tweetActions.setTwitterView,
          };
          ExtensionMessagingHub.sendMessage(
            'background',
            null,
            'messageToPopup',
            twitterViewResponse
          )
            .then((response) => console.log(response))
            .catch((error) => console.error(error));
          break;
        case tweetActions.loadRelevantTweets:
          const relevantTweets = this.getAndFormatRelevantTweets();

          const allTweetsOnPage = this.getTweetsFromPage();

          const relevantTweetsHTML =
            this.getRelevantTweetsFromEthUser(allTweetsOnPage);
          const relevantTweetsResponse = {
            messageAction: tweetActions.loadRelevantTweets,
            relevantTweets: relevantTweets,
            relevantTweetsHTML: JSON.stringify(relevantTweetsHTML),
          };
          ExtensionMessagingHub.sendMessage(
            'background',
            null,
            'messageToPopup',
            relevantTweetsResponse
          )
            .then((response) => {})
            .catch((error) => console.error(error));
          break;
        case tweetActions.renderTweetsInfo:
          let { relevantTweetsToRender } = payload;

          const pasta = this.getTweetsFromPage();
          console.log('the pasta', pasta);
          let relevantTweetsToRenderOn =
            this.getRelevantTweetsFromEthUser(pasta);

          this.addBalancesDataToTweets(
            relevantTweetsToRenderOn,
            relevantTweetsToRender
          );
          break;
        default:
          console.warn(`Unknown action: ${action}`);
      }

      sendResponse({ status: 'completed' });
    }
  };

  private getTwitterProfileElementsToRenderBoxOn(
    element: HTMLElement
  ): HTMLElement[] {
    const elements = Array.from(
      element.querySelectorAll('[data-testid="User-Name"]')
    ) as HTMLElement[];

    return elements;
  }

  private getTwitterProfileElementToRenderBoxOn(
    element: HTMLElement
  ): Element | null {
    const profileElement = element.querySelector('[data-testid="User-Name"]');
    return profileElement;
  }

  private getTweetElementToRenderBoxOn(element: HTMLElement): Element | null {
    const tweetElement = element.querySelector('[data-testid="tweetText"]');
    return tweetElement as HTMLElement;
  }

  private getRelevantTweetsFromEthUser(
    tweetElements: HTMLElement[]
  ): HTMLElement[] {
    const tweetsWithENS = tweetElements.filter((tweet: HTMLElement) => {
      const userNameSection =
        this.getTwitterProfileElementsToRenderBoxOn(tweet);
      const hasEnsText = userNameSection.some((element: HTMLElement) => {
        return element.innerText.includes('.eth');
      });
      return hasEnsText;
    });
    return tweetsWithENS;
  }

  private getTweetsFromPage(): HTMLElement[] {
    return Array.from(document.querySelectorAll('article'));
  }

  private getTwitterProfileUsernameAndHandleFromUsernameElement(
    usernameElement: HTMLElement
  ) {
    const getHandleInfo = (spans: any) => {
      if (spans && spans.length > 0) {
        const elementWithAtSymbol = Array.from(spans).find((el) =>
          el.innerText.includes('@')
        );
        return elementWithAtSymbol ? elementWithAtSymbol.innerText : '';
      }
      return '';
    };
    const getUsernameInfo = (spans: any) => {
      if (spans && spans.length) {
        const elementWithAtSymbol = Array.from(spans).find((el: any) => {
          return el.innerText && el.innerText.length > 0;
        });
        return elementWithAtSymbol ? elementWithAtSymbol.innerText : '';
      }
      return '';
    };
    const anchorElements = usernameElement
      ? usernameElement.querySelector('a')
      : null;
    const firstDivInAnchorElement = anchorElements
      ? anchorElements.querySelector('div')
      : null;
    const firstDivWithinFirstDivInAnchorElement = firstDivInAnchorElement
      ? firstDivInAnchorElement.querySelector('div')
      : null;
    const spanElementsFromAnchor = firstDivWithinFirstDivInAnchorElement
      ? firstDivWithinFirstDivInAnchorElement.querySelectorAll('span')
      : null;
    const spanElements = usernameElement
      ? usernameElement.querySelectorAll('span')
      : null;

    return {
      handle: getHandleInfo(spanElements),
      username: getUsernameInfo(spanElementsFromAnchor),
    };
  }

  private getTwitterProfileImageFromTweet(tweetHTML: HTMLElement) {
    if (tweetHTML) {
      const userProfileParentElement = tweetHTML.querySelector(
        '[data-testid="Tweet-User-Avatar"]'
      );
      const imageElementFromParentElement = userProfileParentElement
        ? userProfileParentElement.querySelector('img')
        : null;
      const imageUrlFromImageElement = imageElementFromParentElement
        ? imageElementFromParentElement.src
        : null;
      return imageUrlFromImageElement ? imageUrlFromImageElement : '';
    }
    return '';
  }

  private getTweetTimestamp(tweetHTML: HTMLElement) {
    if (tweetHTML) {
      const timeElementFromTweet = tweetHTML.querySelector('time');
      const tweetTimestamp = timeElementFromTweet
        ? timeElementFromTweet.dateTime
        : '';
      return tweetTimestamp;
    }
    return '';
  }

  private getTweetEngagementValues(
    tweetHTML: HTMLElement,
    engagementType: 'reply' | 'like' | 'retweet'
  ) {
    if (tweetHTML && engagementType) {
      const engagementElement = tweetHTML.querySelector(
        `[data-testid=${engagementType}]`
      );
      const engagementElementTag = engagementElement
        ? engagementElement.ariaLabel
        : null;
      const engagementValue = engagementElementTag
        ? engagementElementTag.split(' ')[0]
        : '0';
      return Number(engagementValue);
    }
    return 0;
  }

  private extractAndFormatTweetInfo(tweetHTML: HTMLElement): TweetType {
    if (tweetHTML) {
      try {
        const tweetContentElement =
          this.getTweetElementToRenderBoxOn(tweetHTML);
        const tweetUserNameSectionElement =
          this.getTwitterProfileElementToRenderBoxOn(tweetHTML);
        const text = tweetContentElement
          ? tweetContentElement.querySelector('span')?.innerText
          : '';
        const username = tweetUserNameSectionElement
          ? this.getTwitterProfileUsernameAndHandleFromUsernameElement(
              tweetUserNameSectionElement
            ).username
          : '';
        const handle = tweetUserNameSectionElement
          ? this.getTwitterProfileUsernameAndHandleFromUsernameElement(
              tweetUserNameSectionElement
            ).handle
          : '';
        const imageUrl = tweetHTML
          ? this.getTwitterProfileImageFromTweet(tweetHTML)
          : '';
        const timestamp = tweetHTML ? this.getTweetTimestamp(tweetHTML) : '';
        const likes = tweetHTML
          ? this.getTweetEngagementValues(tweetHTML, 'like')
          : 0;
        const replies = tweetHTML
          ? this.getTweetEngagementValues(tweetHTML, 'reply')
          : 0;
        const retweets = tweetHTML
          ? this.getTweetEngagementValues(tweetHTML, 'retweet')
          : 0;

        return {
          text,
          username,
          handle,
          imageUrl,
          timestamp,
          likes,
          replies,
          retweets,
        };
      } catch (e) {}
    }
  }

  private getAndFormatRelevantTweets() {
    const allTweetsOnPage = this.getTweetsFromPage();
    const relevantTweets = this.getRelevantTweetsFromEthUser(allTweetsOnPage);
    const formattedRelevantTweets =
      relevantTweets && relevantTweets.length
        ? relevantTweets.reduce((formattedTweets: any[], tweet) => {
            const formattedTweetObject = this.extractAndFormatTweetInfo(tweet);
            if (formattedTweetObject) {
              formattedTweets.push(formattedTweetObject);
            }
            return formattedTweets;
          }, [])
        : [];
    return formattedRelevantTweets;
  }

  private extractTokensInfoFromTweetContent(tweetContent: HTMLElement) {
    const tokensObjectByName = getTokensDataObjectByName();
    const tokensObjectBySymbol = getTokensDataObjectBySymbol();
    const tweetText = tweetContent.querySelector('span')?.innerText;
    // check text for tokens
    const tokensInTweet = tweetText
      ?.split(' ')
      .reduce((overallTokens: any[], currVal: any) => {
        const normalizedText = removeSpecialCharacters(currVal).toLowerCase();
        let potentialTokenToAdd: any = {};
        if (
          tokensObjectBySymbol[normalizedText] ||
          tokensObjectByName[currVal]
        ) {
          if (tokensObjectBySymbol[normalizedText]) {
            potentialTokenToAdd['symbol'] = normalizedText;
          }
          if (tokensObjectByName[normalizedText]) {
            potentialTokenToAdd['name'] = normalizedText;
          }
          overallTokens.push(potentialTokenToAdd);
        }
        return overallTokens;
      }, []);
    return tokensInTweet;
  }

  constructor() {
    this.tweets = [];
    // Listen for messages from popup
    ExtensionMessagingHub.listenForMessages(
      'messageToContentScript',
      this.handleMessageFromPopup
    );
    // this.interval = window.setInterval(() => {
    //   const allTweetsOnPage = this.getTweetsFromPage();
    //   const relevantTweets = this.getRelevantTweetsFromEthUser(allTweetsOnPage);
    //   if (relevantTweets.length === 0) return;
    //   this.addBalancesDataToTweets(relevantTweets);
    // }, 5000); // Interval of 5 seconds (adjust as needed)
  }

  private addBalancesDataToTweets(tweets: any[], extractedTweets: any[]) {
    tweets.forEach((tweet: any, index: number) => {
      const currentExtractedTweet = extractedTweets[index];

      // const elementToRenderOn = this.getTweetElementToRenderBoxOn(tweet);
      if (!tweet || !currentExtractedTweet) {
        return;
      }
      const addedRelevantTweet = new AddBalancesToElement(
        currentExtractedTweet.walletAddress,
        currentExtractedTweet.walletBalance,
        tweet
      );
      addedRelevantTweet.appendENSName();
    });
  }
}
