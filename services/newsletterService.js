const Newsletter = require("../src/models/Newsletter");

async function subscribeEmail(email) {
  const existing = await Newsletter.findOne({ email });

  if (existing) {
    return { alreadySubscribed: true };
  }

  await Newsletter.create({ email });

  return { subscribed: true };
}

module.exports = {
  subscribeEmail,
};
