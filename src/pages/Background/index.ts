import messagingHub from '../../messaging';

messagingHub.listenForMessages(
  'toggleBalances',
  (data, sender, sendResponse) => {
    console.log('Toggling balances!');
    // Add your logic to toggle balances here
  }
);

messagingHub.listenForMessages(
  'someOtherType',
  (data, sender, sendResponse) => {
    console.log('Handling some other type of message');
    // Add your logic to handle this type of message here
  }
);
