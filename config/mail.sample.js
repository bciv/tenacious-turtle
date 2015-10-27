// Copy in your particulars and rename this to mail.js
module.exports = {
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 587,
  secureConnection: false,
  //name: "servername",
  auth: {
    user: "bcollinsiv@gmail.com",
    pass: "At0mic!!"
  },
  ignoreTLS: false,
  debug: false,
  maxConnections: 5 // Default is 5
}
