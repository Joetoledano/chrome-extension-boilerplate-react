import { fetchAddressForENSName } from '../../../Client';
import {
  extractEthAddress,
  hasChildElementWithClassName,
} from '../../../lib/helpers';
import { balancesFetcherModule } from '../modules/BalancesModule';
import { DOMHelper } from '../modules/DOMModule/DOMHelper';

export class AddBalancesToElement {
  private element: HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  public async appendENSName(): Promise<void> {
    const nameWithENS = this.element;
    const hasChild = this.element
      ? hasChildElementWithClassName('box-header', this.element)
      : true;
    if (hasChild) return;

    const filteredENSText = nameWithENS?.innerText
      ? extractEthAddress(nameWithENS?.innerText)
      : null;
    if (nameWithENS && filteredENSText) {
      const ensAddress: any = filteredENSText
        ? await fetchAddressForENSName(filteredENSText.trim())
        : null;
      if (ensAddress) {
        const balancesFetcher = new balancesFetcherModule();
        const boxEl = DOMHelper.buildBox('balances-box');
        const boxHeader = DOMHelper.buildBoxHeader(ensAddress);
        boxEl.appendChild(boxHeader);
        const valueFields = [
          {
            title: 'Balance',
            value: await balancesFetcher.getFormattedBalance(ensAddress),
          },
        ];
        const boxValuesContainer = DOMHelper.createValuesContainer(valueFields);
        boxEl.appendChild(boxValuesContainer);
        this.element.appendChild(boxEl);
      }
    }
  }
}
