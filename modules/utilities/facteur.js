const nodemailer = require("nodemailer");
const logger = require("./logger");
const { processName, paths, fileNames } = require("../../config");
const { getShortTimestamp } = require("./utilities");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.MAIL_FROM,
    pass: process.env.MAIL_FROM_SECRET,
  },
});

function handleMailResult(err, info) {
  if (err) {
    logger.log("ERROR SENDING EMAIL!" + err);
    logger.log("Info:");
    logger.log(JSON.stringify(info));
    logger.log("Error:");
    logger.log(JSON.stringify(err));
  } else {
    logger.log("Successfully sent an email.");
    logger.log("Email info:");
    logger.log(JSON.stringify(info));
  }
}

/**
 *
 * @param {string} title
 * @param {string} description
 */
function onSendEmail(title, description) {
  logger.log(
    "Sending an email. Title: " + title + " Description: " + description
  );
}

function sendTestEmail() {
  sendEmail("TEST!", "THIS IS A TEST!");
}

/**
 * Sends an email to the correct email address in an 'error report' format.
 * @param {string} subject The email subject. This will go prefixed with "[Program Name] Error Report! "
 * @param {string} description The context of the situation. What is going on where the code errored? What was the code attempting to do?
 * @param {string} header The header is the title in the email html itself.
 * @param {*} err The thrown error.
 * @param {*} importantParameters Extra parameters that might be of importance for debugging.
 */
async function sendErrorReport(
  subject,
  header,
  description,
  err,
  importantParameters
) {
  const newSubject = processName + " error report! " + subject;

  const headerHTML = `<h2>${header}</h2>`;
  const descriptionTitleHTML = `<h3>Description / Context</h3>`;
  const descriptionHTML = `<p>${description}</p>`;
  const importantParametersTitleHTML = `<h3>Important Parameters</h3>`;

  const importantParametersHTML = importantParameters
    ? `<p>${JSON.stringify(importantParameters)}</p>`
    : `<p>None given.</p>`;

  const errorTitleHTML = `<h3>Error Log</h3>`;
  const errorHTML = `<p>${JSON.stringify(err)}</p>`;

  const mailHTML =
    headerHTML +
    descriptionTitleHTML +
    descriptionHTML +
    importantParametersTitleHTML +
    importantParametersHTML +
    errorTitleHTML +
    errorHTML;

  onSendEmail(newSubject, description);

  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      subject: newSubject,
      html: mailHTML,
    });

    handleMailResult(null, info);
    return info;
  } catch (error) {
    handleMailResult(error, null);
    throw error;
  }
}

/**
 * Mails a report. Preferably used by the report manager. The description is information that gives context as to when during the process this is sent. The infovar is the reports variable.
 * @param {string} description
 * @param {*} infoVar
 */
function sendReport(title, description, infoVar) {
  const subject = processName + " reporting in! " + title;
  const headerHTML = "<h2>" + title + "</h2>";
  const descriptionTitleHTML = "<h3>" + "Description / Context" + "</h3>";
  const descriptionHTML = "<p>" + description + "</p>";
  const reportedParametersTitleHTML = "<h3>" + "Report" + "</h3>";
  const reportedParameters = JSON.stringify(infoVar);

  const mailHTML =
    headerHTML +
    descriptionTitleHTML +
    descriptionHTML +
    reportedParametersTitleHTML +
    reportedParameters;

  onSendEmail(subject, description);

  transporter.sendMail(
    {
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      subject: subject,
      html: mailHTML,
    },
    (err, info) => handleMailResult(err, info)
  );
}

/**
 * Sends an email to MAIL_TO address with the logs file attached to it.
 * @param {text} subject Subject text for the email
 * @param {text} description Description text for the email
 * @param {boolean} clear If true, clears the logs file after successfully sending the email
 */
async function sendLogsMail(subject, description, clear = false) {
  onSendEmail(subject, description);

  var logFileName = "logs_" + getShortTimestamp() + "_" + processName + ".txt";

  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      subject,
      text: description,
      attachments: [
        {
          filename: logFileName,
          path: paths.logs + fileNames.logs,
        },
      ],
    });

    handleMailResult(null, info);
    if (clear) logger.clearLogFile();
  } catch (err) {
    handleMailResult(err, null);
    throw err;
  }
}

/**
 *
 * @param {string} subject
 * @param {string} text
 */
function sendEmail(subject, text) {
  onSendEmail(subject, text);

  transporter.sendMail(
    {
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      subject: subject,
      text: text,
    },
    (err, info) => handleMailResult(err, info)
  );
}

module.exports = { sendTestEmail, sendErrorReport, sendReport, sendLogsMail };
