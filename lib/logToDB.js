


const logToDB = async (db, level, message, meta = {}) => {
  try {
    await db.collection('logs').insertOne({
      level,
      message,
      meta,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Failed to write log to DB', error);
  }
};

module.exports = { logToDB };
