import { profileActions } from '../../../lib/constants/ActionMessages';
import ExtensionMessagingHub from '../../../messaging';

import { extractEthAddress } from '../../../lib/helpers';
import { AddBalancesToElement } from '../AddBalancesToElement';
export class TwitterProfileEnhancer {
  private twitterProfileElement: HTMLElement | null;
  private twitterElementToRenderBoxOn: HTMLElement | null;
  private pageLoadInterval: NodeJS.Timeout | null | undefined;

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
        case profileActions.loadProfileInfo:
          // GET THE HANDLE AND ADDRESS AND SEND BACK
          const twitterHandleElement = this.getTwitterProfileHandleElement();
          const twitterElementWithENS = this.getProfileElement();
          const filteredENSText: string | null =
            twitterElementWithENS?.innerText
              ? extractEthAddress(twitterElementWithENS.innerText)
              : null;
          const ensAddress = filteredENSText;

          const loadProfileResponse = {
            handle: twitterHandleElement?.innerText,
            address: ensAddress,
          };
          // Sending message back to popup through background
          ExtensionMessagingHub.sendMessage(
            'background',
            null,
            'messageToPopup',
            loadProfileResponse
          )
            .then((response) => console.log(response))
            .catch((error) => console.error(error));
          // TODO: Perform action to load Twitter handle
          // e.g., loadTwitterHandle(payload); // Where payload can contain any necessary data
          break;

        case profileActions.renderProfileInfo:
          const { walletBalance, walletAddress } = payload;
          if (walletBalance !== undefined && walletAddress.length) {
            this.runEnhancements(walletAddress, walletBalance);
          }
          // TODO: Perform action to load wallet address
          // e.g., loadWalletAddress(payload);
          break;

        default:
          console.warn(`Unknown action: ${action}`);
      }

      sendResponse({ status: 'completed' });
    }
  };

  private getProfileElement(): HTMLElement | null {
    const namesWithENS = Array.from(document.querySelectorAll('span')).filter(
      (el) => el?.innerText?.includes('.eth')
    );

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
  private getTwitterProfileElementToRenderBoxOn(): HTMLElement | null {
    const elements = document.querySelectorAll('[data-testid="UserName"]');
    if (elements && elements.length > 0) {
      return elements[0] as HTMLElement;
    }
    return null;
  }
  private getTwitterProfileHandleElement(): HTMLElement | null {
    const elementsUnderUsername = document.querySelector(
      '[data-testid="UserName"]'
    );
    const elements = elementsUnderUsername
      ? elementsUnderUsername.querySelectorAll('span')
      : null;
    if (elements && elements.length > 0) {
      const elementWithAtSymbol = Array.from(elements).find((el) =>
        el.innerText.includes('@')
      );
      return elementWithAtSymbol as HTMLElement;
    }
    return null;
  }
  private checkIfElementAlreadyOnDOM(): boolean {
    const balancesBoxUnderName = Array.from(
      this.twitterProfileElement?.getElementsByClassName('balances-box') || []
    );
    const twitterProfileUsername = this.getTwitterProfileElementToRenderBoxOn();
    const balancesBoxAboveNav = twitterProfileUsername
      ? twitterProfileUsername.getElementsByClassName('balances-box')
      : [];
    return balancesBoxUnderName.length > 0 || balancesBoxAboveNav.length > 0;
  }
  private checkPageLoaded(): void {
    if (document.readyState === 'complete') {
      this.runEnhancements();
      if (this.checkIfElementAlreadyOnDOM()) {
        clearInterval(this.pageLoadInterval!);
      }
    }
  }

  private runEnhancements(
    walletAddressForProfile: string,
    balanceForProfile: number
  ): void {
    this.twitterProfileElement = this.twitterProfileElement
      ? this.twitterProfileElement
      : this.getProfileElement();
    this.twitterElementToRenderBoxOn = this.twitterElementToRenderBoxOn
      ? this.twitterElementToRenderBoxOn
      : this.getTwitterProfileElementToRenderBoxOn();

    if (this.twitterProfileElement && this.twitterElementToRenderBoxOn) {
      if (!this.checkIfElementAlreadyOnDOM()) {
        const twitterProfileAddBalancesHelper = new AddBalancesToElement(
          walletAddressForProfile,
          balanceForProfile,
          this.twitterElementToRenderBoxOn
        );

        if (twitterProfileAddBalancesHelper) {
          twitterProfileAddBalancesHelper.appendENSName();
        }
      }
    }
  }

  constructor() {
    this.twitterProfileElement = this.getProfileElement();
    this.twitterElementToRenderBoxOn =
      this.getTwitterProfileElementToRenderBoxOn();

    // Listen for messages from popup
    ExtensionMessagingHub.listenForMessages(
      'messageToContentScript',
      this.handleMessageFromPopup
    );
  }
}
