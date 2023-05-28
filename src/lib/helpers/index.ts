import { tokensData } from '../../tokensData';

export function extractEthAddress(inputString: string) {
  const cleanedString = inputString.replace(/[^\w\s.]/g, ''); // Remove special characters except for word characters, spaces, and periods
  const regex = /(\S*\.eth)/g;
  const matches = cleanedString.match(regex);

  if (matches && matches.length > 0) {
    const lastMatch = matches[matches.length - 1];
    if (cleanedString === lastMatch) {
      return lastMatch;
    } else if (/\s/.test(cleanedString)) {
      return lastMatch;
    }
  }

  return null;
}

export function removeSpecialCharacters(str: string): string {
  // This regular expression matches any character that is not a letter (case insensitive), a number, an underscore, or a whitespace.
  let regex = /[^a-z0-9_ \n]/gi;
  // Replace matches with an empty string.
  return str.replace(regex, '');
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

export function hasChildElementWithClassName(
  className: string,
  element: HTMLElement
): boolean {
  const childElements = element.getElementsByClassName(className);
  return childElements.length > 0;
}

export function buildBoxHeader(title: string) {
  if (document) {
    const boxHeader = document.createElement('div');
    boxHeader.classList.add('box-header');

    const boxHeaderLeftIcon = document.createElement('p');
    boxHeaderLeftIcon.textContent = '🧳';

    const boxHeaderTitle = document.createElement('p');
    boxHeaderTitle.textContent = `${title}'s Wallet Stats`;

    boxHeader.appendChild(boxHeaderLeftIcon);
    boxHeader.appendChild(boxHeaderTitle);
    return boxHeader;
  }
}

export function buildBox(className: string): HTMLElement {
  const boxEl = document.createElement('div');
  boxEl.classList.add(className);
  return boxEl;
}

export function createValuesContainer(): HTMLElement {
  const boxValuesContainer = document.createElement('div');
  boxValuesContainer.classList.add('values-container');
  return boxValuesContainer;
}

export function addToggleButton(parentContainer: HTMLElement) {
  if (document) {
    const boxToggleButton = document.createElement('button');
    const boxToggleButtonText = document.createTextNode('Display');
    boxToggleButton.appendChild(boxToggleButtonText);
    boxToggleButton.classList.add('display-button');
    boxToggleButton.addEventListener('click', () => {
      parentContainer.classList.toggle('hidden');
      const buttonText = parentContainer.classList.contains('hidden')
        ? 'Display'
        : 'Hide';
      boxToggleButtonText.nodeValue = buttonText;
    });
    return boxToggleButton;
  }
}

type tokenDataObjType = {
  id: string;
  name: string;
  symbol: string;
};

export const getTokensDataObjectByName = () => {
  let dataObject = tokensData.reduce((obj: any, item: tokenDataObjType) => {
    obj[item.name] = item;
    return obj;
  }, {});
  return dataObject;
};

export const getTokensDataObjectBySymbol = () => {
  let dataObject = tokensData.reduce((obj: any, item: tokenDataObjType) => {
    obj[item.symbol] = item;
    return obj;
  }, {});
  return dataObject;
};
