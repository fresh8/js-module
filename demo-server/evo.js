const fresh8Config = { instID: '342094' };
// const fresh8Config = { instID: "473256" };

// eslint-disable-next-line no-undef
const fresh8 = new Fresh8(fresh8Config);

const adConfig = { slotID: 'f8-5', appendPoint: 'body', view: 'football' };

fresh8.requestAd(adConfig);

window.fresh8 = fresh8;
