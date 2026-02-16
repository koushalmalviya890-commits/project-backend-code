const mongoose = require("mongoose");
const dayjs = require("dayjs");

const Booking = require("../src/models/Booking");
const Startup = require("../src/models/Startup");
const Notification = require("../src/models/Notification");
const { sendReminderEmailToStartup } = require("./email");

async function checkAndSendReminders() {
  try {
    const today = dayjs().startOf("day");
    const reminderWindow = today.add(3, "days");

    console.log(
      ` Checking bookings expiring between ${today.format()} and ${reminderWindow.format()}`
    );

    const bookings = await Booking.find({
      paymentStatus: "completed",
      endDate: {
        $gte: today.toDate(),
        $lte: reminderWindow.toDate(),
      },
    }).lean();

    for (const booking of bookings) {
      const startup = await Startup.findOne({
        userId: new mongoose.Types.ObjectId(booking.startupId),
      }).lean();

      if (!startup || !startup.startupMailId) {
        console.warn(
          ` Skipping booking ${booking._id} — startup or email not found.`
        );
        continue;
      }

      const alreadyNotified = await Notification.findOne({
        userId: booking.startupId.toString(),
        relatedId: booking._id.toString(),
        type: "plan-expiry-reminder",
      });

      if (alreadyNotified) {
        continue;
      }

      try {
        await sendReminderEmailToStartup({
          to: startup.startupMailId,
          startupName: startup.startupName || "Your Startup",
          facilityName: booking.facilityName || "Your Facility",
          rentalPlan: booking.rentalPlan || "N/A",
          endDate: booking.endDate,
        });

        console.log(
          ` Sent reminder to ${startup.startupMailId} for booking ${booking._id}`
        );


        await Notification.create({
          userId: booking.startupId.toString(),
          type: "plan-expiry-reminder",
          title: "Rental Plan Expiry Reminder",
          message: `Your rental plan (${
            booking.rentalPlan
          }) will end on ${dayjs(booking.endDate).format("YYYY-MM-DD")}`,
          relatedId: booking._id.toString(),
          relatedType: "booking",
          isRead: false,
          createdAt: new Date(),
          metadata: {
            startupName: startup.startupName,
            facilityName: booking.facilityName,
            rentalPlan: booking.rentalPlan,
            endDate: booking.endDate,
          },
        });

        
      } catch (err) {
        console.error(`❌ Reminder process failed for booking ${booking._id}`, err);
      }
    }

    console.log(" Reminder check completed.");
  } catch (error) {
    console.error(" Reminder job crashed:", error);
  }
}

module.exports = { checkAndSendReminders };