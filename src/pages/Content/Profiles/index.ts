import { AddBalancesToElement } from '../AddBalancesToElement';

export class TwitterProfileEnhancer {
  private twitterProfileElement: HTMLElement | null;

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

  constructor() {
    this.twitterProfileElement = this.getProfileElement();
    if (this.twitterProfileElement) {
      const twitterProfileStuff = new AddBalancesToElement(
        this.twitterProfileElement
      );
      twitterProfileStuff.appendENSName();
    }
  }
}
