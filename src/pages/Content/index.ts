import { TwitterProfileEnhancer } from './Profiles';
import { TweetEnhancer } from './Tweets';

(function () {
  class ContentScript {
    run(): void {
      if (
        typeof window !== 'undefined' &&
        window.location.href.includes('twitter') &&
        !document.body.classList.contains('enhanced')
      ) {
        if (window.location.href.includes('twitter.com/home')) {
          new TweetEnhancer();
        } else {
          new TwitterProfileEnhancer();
        }
        document.body.classList.add('enhanced');
      }
    }
  }

  const contentScript = new ContentScript();

  // Assume this is the data you want to send to the popup
  let data = {
    address: '0x123',
    balance: '4.2 ETH',
  };

  // Send the data to the background script
  chrome.runtime.sendMessage({ message: 'dataForPopup', data: data });

  // Send a message to the background script

  contentScript.run();

  document.addEventListener('DOMContentLoaded', () => {
    const runContentScript = (): void => {
      const contentScript = new ContentScript();
      contentScript.run();
    };

    // Run the content script initially
    runContentScript();

    // Utility function for debouncing function calls
    const debounce = <F extends (...args: any[]) => void>(
      func: F,
      delay: number
    ): ((...args: Parameters<F>) => void) => {
      let timeoutId: ReturnType<typeof setTimeout>;
      return function (this: any, ...args: Parameters<F>): void {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
      };
    };

    // Attach the event listeners with debounced function calls
    window.addEventListener(
      'popstate',
      debounce(contentScript.run.bind(contentScript), 200)
    );
    window.addEventListener(
      'scroll',
      debounce(contentScript.run.bind(contentScript), 200)
    );
    window.addEventListener(
      'hashchange',
      debounce(contentScript.run.bind(contentScript), 200)
    );
  });
})();
