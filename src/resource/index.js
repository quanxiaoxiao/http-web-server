module.exports = {
  '/resource': {
    get: {
      body: require('./current'),
    },
    post: {
      body: require('./upload'),
    },
  },
  '/resources': {
    body: require('./list'),
  },
  '/resource/prev': {
    put: {
      body: require('./prev'),
    },
  },
  '/resource/last': {
    put: {
      body: require('./last'),
    },
  },
  '/resource/:id': {
    put: {
      body: require('./update'),
    },
  },
};
