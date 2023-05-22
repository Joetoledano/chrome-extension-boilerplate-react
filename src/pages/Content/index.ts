import { TwitterProfileEnhancer } from './Profiles';
import { TweetEnhancer } from './Tweets';

class ContentScript {
  constructor() {}

  public run(): void {
    if (
      typeof window !== 'undefined' &&
      window.location.href.includes('twitter')
    ) {
      if (window.location.href.includes('twitter.com/home')) {
        new TwitterProfileEnhancer();
      } else {
        new TweetEnhancer();
      }
    }
  }
}

const contentScript = new ContentScript();
contentScript.run();

document.addEventListener('DOMContentLoaded', function (event) {
  // Call your functions here
  if (
    typeof window !== 'undefined' &&
    window.location.href.includes('twitter')
  ) {
    if (window.location.href.includes('twitter.com/home')) {
      new TwitterProfileEnhancer();
    } else {
      new TweetEnhancer();
    }
  }
});

window.addEventListener('popstate', function () {
  // URL has changed
  if (
    typeof window !== 'undefined' &&
    window.location.href.includes('twitter')
  ) {
    if (window.location.href.includes('twitter.com/home')) {
      new TwitterProfileEnhancer();
    } else {
      new TweetEnhancer();
    }
  }
});

window.addEventListener('scroll', function () {
  // URL has changed
  if (
    typeof window !== 'undefined' &&
    window.location.href.includes('twitter')
  ) {
    if (window.location.href.includes('twitter.com/home')) {
      new TwitterProfileEnhancer();
    } else {
      new TweetEnhancer();
    }
  }
});

window.addEventListener('hashchange', function () {
  // URL has changed
  if (
    typeof window !== 'undefined' &&
    window.location.href.includes('twitter')
  ) {
    if (window.location.href.includes('twitter.com/home')) {
      new TwitterProfileEnhancer();
    } else {
      new TweetEnhancer();
    }
  }
});
