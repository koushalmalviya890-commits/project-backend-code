// services/cronJobService.js
const cron = require("node-cron");
const moment = require("moment-timezone");
const EventDetail = require("../src/models/EventDetails");
const EventBookingDetail = require("../src/models/EventBookingDetails");
const { sendPostEventFeedbackEmail } = require("../lib/emailService");
const {
  sendOneHourReminderEmail,
  sendOneDayReminderEmail,
} = require("../lib/emailService");

class CronJobService {
  constructor() {
    this.jobs = new Map();
    this.startCronJobs();
  }

  // Helper function to format time for console logs
  formatTime(momentObj) {
    return {
      utc: momentObj.format("YYYY-MM-DD HH:mm:ss [UTC]"),
      ist: momentObj
        .clone()
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD HH:mm:ss [IST]"),
      iso: momentObj.toISOString(),
    };
  }

  startCronJobs() {
    // Run every minute to check for all scheduled tasks
    cron.schedule("* * * * *", () => {
      const now = moment().utc();
      const timeInfo = this.formatTime(now);

      console.log("\n" + "=".repeat(80));
      console.log(
        `🕒 Cron Check Started at: ${timeInfo.utc} (${timeInfo.ist})`,
      );
      console.log("=".repeat(80));

      this.checkPostEventFeedbackSchedules();
      this.checkEventReminders();

      console.log("=".repeat(80));
      console.log(
        `✅ Cron Check Completed at: ${moment().utc().format("YYYY-MM-DD HH:mm:ss [UTC]")}`,
      );
      console.log("=".repeat(80) + "\n");
    });

    const startTime = this.formatTime(moment().utc());
    console.log("\n" + "🚀".repeat(20));
    console.log("🚀 Cron Service Initialized Successfully! 🚀");
    console.log(`🕒 Started at: ${startTime.utc} (${startTime.ist})`);
    console.log("📧 Monitoring: Post-event feedback schedules");
    console.log("⏰ Monitoring: Event reminders (1 hour & 1 day before)");
    console.log("🔄 Check Frequency: Every minute");
    console.log("🚀".repeat(20) + "\n");
  }

  // Existing post-event feedback function with enhanced logging
  async checkPostEventFeedbackSchedules() {
    try {
      const now = moment().utc();
      const timeInfo = this.formatTime(now);

      console.log("📧 POST-EVENT FEEDBACK CHECK");
      console.log(`   Current Time: ${timeInfo.utc} (${timeInfo.ist})`);

      // Calculate search window
      const windowStart = now.clone().subtract(1, "minute");
      const windowEnd = now.clone().add(1, "minute");

      console.log(
        `   Search Window: ${windowStart.format("HH:mm:ss")} to ${windowEnd.format("HH:mm:ss")} UTC`,
      );

      const eventsWithFeedback = await EventDetail.find({
        postEventFeedback: true,
        "postEventFeedbackDetails.scheduledDateTime": {
          $gte: windowStart.toDate(),
          $lte: windowEnd.toDate(),
        },
      });

      console.log(
        `   📊 Query Result: ${eventsWithFeedback.length} events found with feedback scheduled`,
      );

      if (eventsWithFeedback.length > 0) {
        console.log("   📧 FEEDBACK EVENTS FOUND:");
        eventsWithFeedback.forEach((event, index) => {
          console.log(`     ${index + 1}. ${event.title} (ID: ${event._id})`);
          event.postEventFeedbackDetails.forEach((detail, detailIndex) => {
            const scheduledTime = moment(detail.scheduledDateTime).utc();
            const timeDiff = Math.abs(now.diff(scheduledTime, "minutes"));
            const timeInfo = this.formatTime(scheduledTime);

            console.log(`        Schedule ${detailIndex + 1}:`);
            console.log(
              `        • Scheduled: ${timeInfo.utc} (${timeInfo.ist})`,
            );
            console.log(`        • Time Diff: ${timeDiff} minute(s)`);
            console.log(
              `        • Content: "${detail.bodyContent.substring(0, 50)}..."`,
            );
            console.log(
              `        • Will Send: ${timeDiff <= 1 ? "✅ YES" : "❌ NO"}`,
            );
          });
        });
      } else {
        console.log("   ℹ️  No feedback events scheduled for this time window");
      }

      // Process events
      for (const event of eventsWithFeedback) {
        for (const feedbackDetail of event.postEventFeedbackDetails) {
          const scheduledTime = moment(feedbackDetail.scheduledDateTime).utc();
          const timeDiff = Math.abs(now.diff(scheduledTime, "minutes"));

          if (timeDiff <= 1) {
            console.log(`   🚀 TRIGGERING feedback for: ${event.title}`);
            await this.sendPostEventFeedbackToAllAttendees(
              event,
              feedbackDetail,
            );
          }
        }
      }
    } catch (error) {
      console.error("❌ Error checking post-event feedback schedules:", error);
    }
  }

  // NEW: Check for event reminders with enhanced logging
  async checkEventReminders() {
    try {
      const now = moment().utc();
      const timeInfo = this.formatTime(now);

      console.log("\n⏰ EVENT REMINDERS CHECK");
      console.log(`   Current Time: ${timeInfo.utc} (${timeInfo.ist})`);

      // Find events that have eventReminder enabled
      const eventsWithReminders = await EventDetail.find({
        eventReminder: true,
        startDateTime: { $gt: now.toDate() }, // Only future events
      });

      console.log(
        `   📊 Query Result: ${eventsWithReminders.length} future events with reminders enabled`,
      );

      if (eventsWithReminders.length === 0) {
        console.log("   ℹ️  No future events with reminders enabled");
        return;
      }

      console.log("   ⏰ CHECKING REMINDER SCHEDULES:");

      let oneHourRemindersSent = 0;
      let oneDayRemindersSent = 0;

      for (const event of eventsWithReminders) {
        const eventStartTime = moment(event.startDateTime).utc();
        const eventTimeInfo = this.formatTime(eventStartTime);

        // Calculate 1 hour and 1 day before event start time
        const oneHourBefore = eventStartTime.clone().subtract(1, "hour");
        const oneDayBefore = eventStartTime.clone().subtract(1, "day");

        const oneHourBeforeInfo = this.formatTime(oneHourBefore);
        const oneDayBeforeInfo = this.formatTime(oneDayBefore);

        // Calculate time differences
        const oneHourDiff = Math.abs(now.diff(oneHourBefore, "minutes"));
        const oneDayDiff = Math.abs(now.diff(oneDayBefore, "minutes"));

        console.log(`     Event: ${event.title}`);
        console.log(
          `     • Event Start: ${eventTimeInfo.utc} (${eventTimeInfo.ist})`,
        );
        console.log(
          `     • 1-Hour Reminder: ${oneHourBeforeInfo.utc} (Diff: ${oneHourDiff}min) ${oneHourDiff <= 1 ? "✅ SEND NOW" : "⏭️ Skip"}`,
        );
        console.log(
          `     • 1-Day Reminder: ${oneDayBeforeInfo.utc} (Diff: ${oneDayDiff}min) ${oneDayDiff <= 1 ? "✅ SEND NOW" : "⏭️ Skip"}`,
        );

        // Check if current time matches 1 hour before (±1 minute window)
        if (oneHourDiff <= 1) {
          console.log(`   🚀 TRIGGERING 1-hour reminders for: ${event.title}`);
          await this.sendEventRemindersToAllAttendees(event, "1hour");
          oneHourRemindersSent++;
        }

        // Check if current time matches 1 day before (±1 minute window)
        if (oneDayDiff <= 1) {
          console.log(`   🚀 TRIGGERING 1-day reminders for: ${event.title}`);
          await this.sendEventRemindersToAllAttendees(event, "1day");
          oneDayRemindersSent++;
        }
      }

      console.log(`   📊 REMINDER SUMMARY:`);
      console.log(`     • 1-Hour Reminders Triggered: ${oneHourRemindersSent}`);
      console.log(`     • 1-Day Reminders Triggered: ${oneDayRemindersSent}`);
    } catch (error) {
      console.error("❌ Error checking event reminders:", error);
    }
  }

  // Enhanced logging for reminder sending
  async sendEventRemindersToAllAttendees(event, reminderType) {
    try {
      const startTime = moment().utc();
      const timeInfo = this.formatTime(startTime);

      console.log(`\n   📨 SENDING ${reminderType.toUpperCase()} REMINDERS`);
      console.log(`     Event: ${event.title}`);
      console.log(`     Started: ${timeInfo.utc} (${timeInfo.ist})`);

      // Get all confirmed bookings for this event
      const bookings = await EventBookingDetail.find({
        eventId: event._id,
        paymentStatus: { $in: ["completed", "free"] },
      });

      console.log(`     📊 Found ${bookings.length} eligible bookings`);

      if (bookings.length === 0) {
        console.log(
          `     ⚠️  No confirmed bookings found for event: ${event.title}`,
        );
        return;
      }

      // Debug booking details
      console.log(`     👥 BOOKING DETAILS:`);
      bookings.forEach((booking, index) => {
        const email = booking.PersonalInfo[0]?.useremail;
        const name = booking.PersonalInfo[0]?.userfullName;
        console.log(
          `       ${index + 1}. ${name || "Unknown"} (${email || "No Email"}) - ${booking.paymentStatus}`,
        );
      });

      // Format event details
      const eventDate = moment(event.startDateTime).format("MMMM DD, YYYY");
      const eventTime = moment(event.startDateTime).format("h:mm A");

      let successCount = 0;
      let errorCount = 0;

      console.log(`     📧 SENDING EMAILS:`);

      // Send reminder email to each attendee
      for (const booking of bookings) {
        try {
          const userEmail = booking.PersonalInfo[0]?.useremail;
          const userName = booking.PersonalInfo[0]?.userfullName;

          if (userEmail) {
            const emailData = {
              to: userEmail,
              userName: userName || "Valued Attendee",
              eventTitle: event.title,
              eventDate: eventDate,
              eventTime: eventTime,
              venue: event.venue,
              venueStatus: event.venueStatus,
              bookingId: booking.bookingRefNumber || booking._id.toString(),
            };

            // Send appropriate reminder based on type
            if (reminderType === "1hour") {
              await sendOneHourReminderEmail(emailData);
            } else if (reminderType === "1day") {
              await sendOneDayReminderEmail(emailData);
            }

            successCount++;
            console.log(
              `       ✅ Sent to: ${userEmail} (${userName || "Unknown"})`,
            );
          } else {
            console.log(`       ⚠️  No email for booking: ${booking._id}`);
          }

          // Add small delay to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (emailError) {
          errorCount++;
          console.error(
            `       ❌ Failed for booking ${booking._id}:`,
            emailError.message,
          );
        }
      }

      const endTime = moment().utc();
      const duration = endTime.diff(startTime, "seconds");
      const endTimeInfo = this.formatTime(endTime);

      console.log(`     📊 ${reminderType.toUpperCase()} REMINDER RESULTS:`);
      console.log(`       • Successfully sent: ${successCount} emails`);
      console.log(`       • Failed to send: ${errorCount} emails`);
      console.log(`       • Total duration: ${duration} seconds`);
      console.log(
        `       • Completed: ${endTimeInfo.utc} (${endTimeInfo.ist})`,
      );
    } catch (error) {
      console.error(
        `❌ Error sending ${reminderType} reminders for event ${event.title}:`,
        error,
      );
    }
  }

  // Enhanced logging for feedback sending
  async sendPostEventFeedbackToAllAttendees(event, feedbackDetail) {
    try {
      const startTime = moment().utc();
      const timeInfo = this.formatTime(startTime);

      console.log(`\n   📨 SENDING POST-EVENT FEEDBACK`);
      console.log(`     Event: ${event.title}`);
      console.log(`     Started: ${timeInfo.utc} (${timeInfo.ist})`);

      const bookings = await EventBookingDetail.find({
        eventId: event._id,
        paymentStatus: { $in: ["completed", "free"] },
      });

      console.log(`     📊 Found ${bookings.length} eligible bookings`);

      if (bookings.length === 0) {
        console.log(
          `     ⚠️  No confirmed bookings found for event: ${event.title}`,
        );
        return;
      }

      const eventDate = moment(event.startDateTime).format("MMMM DD, YYYY");
      const eventTime = moment(event.startDateTime).format("h:mm A");

      let successCount = 0;
      let errorCount = 0;

      console.log(`     📧 SENDING FEEDBACK EMAILS:`);

      for (const booking of bookings) {
        try {
          const userEmail = booking.PersonalInfo[0]?.useremail;
          const userName = booking.PersonalInfo[0]?.userfullName;

          if (userEmail) {
            await sendPostEventFeedbackEmail({
              to: userEmail,
              serviceProviderId: event.serviceProviderId,
              eventId: event._id,
              userName: userName || "Valued Attendee",
              eventTitle: event.title,
              eventDate: eventDate,
              eventTime: eventTime,
              venue: event.venue,
              bookingId: booking.bookingRefNumber || booking._id.toString(),
              customContent: feedbackDetail.bodyContent,
              feedbackUrl: null,
            });

            successCount++;
            console.log(
              `       ✅ Sent to: ${userEmail} (${userName || "Unknown"})`,
            );
          } else {
            console.log(`       ⚠️  No email for booking: ${booking._id}`);
          }

          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (emailError) {
          errorCount++;
          console.error(
            `       ❌ Failed for booking ${booking._id}:`,
            emailError.message,
          );
        }
      }

      const endTime = moment().utc();
      const duration = endTime.diff(startTime, "seconds");
      const endTimeInfo = this.formatTime(endTime);

      console.log(`     📊 FEEDBACK EMAIL RESULTS:`);
      console.log(`       • Successfully sent: ${successCount} emails`);
      console.log(`       • Failed to send: ${errorCount} emails`);
      console.log(`       • Total duration: ${duration} seconds`);
      console.log(
        `       • Completed: ${endTimeInfo.utc} (${endTimeInfo.ist})`,
      );
    } catch (error) {
      console.error(
        `❌ Error sending post-event feedback for event ${event.title}:`,
        error,
      );
    }
  }

  // Manual trigger for event reminders (with enhanced logging)
  async triggerEventReminders(eventId, reminderType = "both") {
    try {
      const triggerTime = this.formatTime(moment().utc());
      console.log(`\n🎯 MANUAL TRIGGER: Event Reminders`);
      console.log(`   Event ID: ${eventId}`);
      console.log(`   Reminder Type: ${reminderType}`);
      console.log(`   Triggered: ${triggerTime.utc} (${triggerTime.ist})`);

      const event = await EventDetail.findById(eventId);
      if (!event || !event.eventReminder) {
        throw new Error("Event not found or event reminders not enabled");
      }

      console.log(`   Event Found: ${event.title}`);
      console.log(
        `   Event Start: ${moment(event.startDateTime).utc().format("YYYY-MM-DD HH:mm:ss [UTC]")}`,
      );

      if (reminderType === "both" || reminderType === "1hour") {
        await this.sendEventRemindersToAllAttendees(event, "1hour");
      }

      if (reminderType === "both" || reminderType === "1day") {
        await this.sendEventRemindersToAllAttendees(event, "1day");
      }

      return {
        success: true,
        message: `Event reminders (${reminderType}) triggered successfully`,
      };
    } catch (error) {
      console.error("Error triggering event reminders:", error);
      return { success: false, error: error.message };
    }
  }

  // Manual trigger for feedback (with enhanced logging)
  async triggerPostEventFeedback(eventId) {
    try {
      const triggerTime = this.formatTime(moment().utc());
      console.log(`\n🎯 MANUAL TRIGGER: Post-Event Feedback`);
      console.log(`   Event ID: ${eventId}`);
      console.log(`   Triggered: ${triggerTime.utc} (${triggerTime.ist})`);

      const event = await EventDetail.findById(eventId);
      if (!event || !event.postEventFeedback) {
        throw new Error("Event not found or post-event feedback not enabled");
      }

      console.log(`   Event Found: ${event.title}`);
      console.log(
        `   Feedback Details: ${event.postEventFeedbackDetails.length} scheduled`,
      );

      for (const feedbackDetail of event.postEventFeedbackDetails) {
        const scheduledTime = this.formatTime(
          moment(feedbackDetail.scheduledDateTime).utc(),
        );
        console.log(
          `   Scheduled Time: ${scheduledTime.utc} (${scheduledTime.ist})`,
        );
        await this.sendPostEventFeedbackToAllAttendees(event, feedbackDetail);
      }

      return {
        success: true,
        message: "Post-event feedback triggered successfully",
      };
    } catch (error) {
      console.error("Error triggering post-event feedback:", error);
      return { success: false, error: error.message };
    }
  }

  // Stop all cron jobs with logging
  stopAllJobs() {
    const stopTime = this.formatTime(moment().utc());
    console.log(`\n🛑 STOPPING CRON JOBS at ${stopTime.utc} (${stopTime.ist})`);

    this.jobs.forEach((job, name) => {
      job.stop();
      console.log(`   🛑 Stopped: ${name}`);
    });
    this.jobs.clear();

    console.log("🛑 All cron jobs stopped successfully\n");
  }
}

module.exports = CronJobService;
