import {
  getTokensDataObjectByName,
  getTokensDataObjectBySymbol,
  removeSpecialCharacters,
} from '../../../lib/helpers';
import { AddBalancesToElement } from '../AddBalancesToElement';
export class TweetEnhancer {
  private tweets: HTMLElement[] | null;
  private interval: number;

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
    return tweetElement;
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
    this.interval = window.setInterval(() => {
      const allTweetsOnPage = this.getTweetsFromPage();
      const relevantTweets = this.getRelevantTweetsFromEthUser(allTweetsOnPage);
      if (relevantTweets.length === 0) return;
      this.addBalancesDataToTweets(relevantTweets);
    }, 5000); // Interval of 5 seconds (adjust as needed)
  }

  private addBalancesDataToTweets(tweets: HTMLElement[]) {
    tweets.forEach((tweet: HTMLElement) => {
      const elementToGetNameFrom =
        this.getTwitterProfileElementToRenderBoxOn(tweet);
      const elementToRenderOn = this.getTweetElementToRenderBoxOn(tweet);
      if (!(elementToGetNameFrom && elementToRenderOn)) return;
      const tokensMentionedInTweets =
        this.extractTokensInfoFromTweetContent(elementToRenderOn);
      const addedRelevantTweet = new AddBalancesToElement(
        elementToGetNameFrom as HTMLElement,
        elementToRenderOn as HTMLElement
      );
      addedRelevantTweet.appendENSName();
    });
  }
}
