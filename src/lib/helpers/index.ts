export function extractEthAddress(inputString: string) {
  const regex = /(\S*\.eth)/g;
  const matches = inputString.match(regex);

  if (matches && matches.length > 0) {
    const lastMatch = matches[matches.length - 1];
    if (inputString === lastMatch) {
      return lastMatch;
    } else if (/\s/.test(inputString)) {
      return lastMatch;
    }
  }

  return null;
}

export const getTwitterNameFromTweet = (tweet: HTMLElement) => {
  if (document) {
    const namesWithENS = Array.from(tweet.querySelectorAll('span')).filter(
      (el) => el?.innerText?.includes('.eth')
    );
    // using the second instance of the ens name to preserve the upper name(risky)
    if (namesWithENS && namesWithENS.length) {
      let nameWithENS;
      if (namesWithENS.length > 2) {
        nameWithENS = namesWithENS[3];
      } else {
        nameWithENS = namesWithENS[1];
      }
      if (nameWithENS) {
        return nameWithENS;
      }
    }
  }
};
