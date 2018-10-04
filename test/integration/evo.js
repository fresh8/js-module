const fresh8Config = { instID: '342094' };

// eslint-disable-next-line no-undef
const fresh8 = new Fresh8(fresh8Config);

const adConfig = {slotID: 'f8-5', appendPoint: 'body', view: 'football'};

fresh8.requestAd(adConfig).then(ad => console.log('Ad loaded', ad));
