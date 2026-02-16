require("dotenv").config();
const cron = require("node-cron");
const { checkAndSendReminders } = require("./reminders");

//Runs daily at 10:52 AM
cron.schedule("52 10 * * *", async () => {
  console.log("⏰ Running reminder job at 10:52 AM...");
  await checkAndSendReminders();
});

//For testing runs every minutes
// cron.schedule("* * * * *", async () => {
//   console.log("⏰ Running every minute for testing...");
//   await checkAndSendReminders();
// });