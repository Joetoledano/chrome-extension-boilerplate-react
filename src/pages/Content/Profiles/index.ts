import { AddBalancesToElement } from '../AddBalancesToElement';

export class TwitterProfileEnhancer {
  private twitterProfileElement: HTMLElement | null;
  private twitterElementToRenderBoxOn: HTMLElement | null;
  private pageLoadInterval: NodeJS.Timeout | null | undefined;

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

  private runEnhancements(): void {
    this.twitterProfileElement = this.twitterProfileElement
      ? this.twitterProfileElement
      : this.getProfileElement();
    this.twitterElementToRenderBoxOn = this.twitterElementToRenderBoxOn
      ? this.twitterElementToRenderBoxOn
      : this.getTwitterProfileElementToRenderBoxOn();

    if (this.twitterProfileElement && this.twitterElementToRenderBoxOn) {
      if (!this.checkIfElementAlreadyOnDOM()) {
        const twitterProfileAddBalancesHelper = new AddBalancesToElement(
          this.twitterProfileElement,
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
    this.pageLoadInterval = setInterval(() => this.checkPageLoaded(), 2000);
  }
}
