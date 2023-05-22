import { AddBalancesToElement } from '../AddBalancesToElement';

export class TweetEnhancer {
  private tweets: HTMLElement | null;

  private getRelevantTweetsFromEthUser(
    tweetElements: HTMLElement[]
  ): HTMLElement | null {
    const namesWithENS = tweetElements
      .filter((elly: HTMLElement) => {
        return elly.tagName === 'SPAN';
      })
      .filter((el) => el?.innerText?.includes('.eth'));

    if (namesWithENS && namesWithENS.length) {
      let nameWithENS: HTMLElement | undefined;
      if (namesWithENS.length > 2) {
        nameWithENS = namesWithENS[3];
      } else {
        nameWithENS = namesWithENS[1];
      }
      if (nameWithENS) {
        return nameWithENS;
      }
    }
    return null;
  }

  private getTweetsFromPage() {
    if (!document) return null;
    return Array.from(document.querySelectorAll('article'));
  }

  constructor() {
    const allTweetsOnPage = this.getTweetsFromPage();
    this.tweets = this.getRelevantTweetsFromEthUser(
      allTweetsOnPage ? allTweetsOnPage : []
    );
    this.addBalancesDataToTweets();
  }

  private addBalancesDataToTweets() {
    if (this.tweets && Array.isArray(this.tweets) && this.tweets.length) {
      this.tweets.forEach((tweet: HTMLElement) => {
        const addedRelevantTweet = new AddBalancesToElement(tweet);
        addedRelevantTweet.appendENSName();
      });
    }
  }
}
