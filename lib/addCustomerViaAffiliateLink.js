const mongoose = require("mongoose");

// exports.addCustomerViaAffiliateLink = async (booking) => {
//   try {
//     const db = mongoose.connection.db;

//     const startupMailId = booking.affiliateUserEmail;

//     if (!startupMailId) {
//       console.warn("No affiliate email found in booking:", booking._id);
//       return;
//     }

//     //  Find affiliate link user
//     const affiliateUser = await db.collection("AffiliateLinkUsers").findOne({
//       mailId: startupMailId,
//     });

//     if (!affiliateUser || !affiliateUser.affiliateId) {
//       console.warn("Affiliate link user not found or no affiliateId");
//       return;
//     }

//     // Increment customer count in affiliatepartners
//     await db.collection("affiliatepartners").updateOne(
//       { _id: new mongoose.Types.ObjectId(affiliateUser.affiliateId) },
//       {
//         $inc: { customers: 1 },
//         $set: { updatedAt: new Date() }
//       }
//     );

//     console.log(
//       `Affiliate customer incremented for affiliateId: ${affiliateUser.affiliateId}`
//     );

//   } catch (error) {
//     console.error("Error in addCustomerViaAffiliateLink:", error);
//     // ❗ Do not throw — must not break payment flow
//   }
// };


// async function addCustomerViaAffiliateLink(booking) {
//   try {
//     const startupMailId = booking.affiliateUserEmail;
//     if (!startupMailId) {
//       console.warn("No startupMailId found in booking:", booking._id.toString());
//       return;
//     }

//     // Send POST request to /api/affiliate/user/customer
//     const response = await fetch(`${process.env.NEXTAUTH_URL || 'https://cumma.in'}/api/affiliate/user/customers`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ startupMailId }),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error("Failed to add customer via affiliate link:", errorData.error);
//       return;
//     }

//     const result = await response.json();
//   } catch (error) {
//     console.error("Error in addCustomerViaAffiliateLink:", error);
//   }
// }


const axios = require('axios');

async function addCustomerViaAffiliateLink(booking) {
  try {
    const startupMailId = booking.affiliateUserEmail;
    if (!startupMailId) {
      console.warn("No startupMailId found in booking:", booking._id.toString());
      return;
    }

    // Send POST request to /api/affiliate/user/customer
    const response = await axios.post(
      `${process.env.NEXTAUTH_URL || 'https://cumma.in'}/api/affiliate/user/customers`,
      { startupMailId },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Failed to add customer via affiliate link:", error.response.data.error || error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received from server:", error.message);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error in addCustomerViaAffiliateLink:", error.message);
    }
  }
}


module.exports = { addCustomerViaAffiliateLink };