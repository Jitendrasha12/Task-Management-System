import NodeMailer from "nodemailer";
import * as Path from "path";
import Fs from "fs";
import Config from "config";
import { htmlToText } from "nodemailer-html-to-text";
import { getRootDir } from "./util.js"; // Ensure this utility is correctly implemented

const mailFrom = Config.get("mailFrom");
console.log(mailFrom,'thisis mailfrom')
export class MailNotifier {
  constructor() {
    this.root = getRootDir();
    console.log(this.root);
    this.transporter = NodeMailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL/TLS
      auth: {
        user: "jitendra.sharma6860@gmail.com",
        pass: "qimmfhntrnmpvyyp", // Ensure this is kept secure and consider using environment variables
      },
    });

    this.transporter.use("compile", htmlToText());
  }

 async sendRegistrationEmail({ to, username }) {
  console.log(to, 'this is to', mailFrom, username);
  console.log(`${this.root}/server/templates/registrationSuccess.html`,'our file path')

  try {
    const mailOptions = {
      from: mailFrom,
      to: to,
      subject: "Registration Successful",
      html: Fs.readFileSync(
        Path.normalize(
          `${this.root}/server/templates/registrationSuccess.html`
        )
      )
        .toString()
        .replace("{{username}}", username), 
    };

    await this.transporter.sendMail(mailOptions);
    console.log("Registration email sent successfully");
  } catch (error) {
    console.error("Error sending registration email:", error);
    throw new Error("Failed to send registration email");
  }
}


  async sendTaskAssignmentEmail({ to, username, title }) {
    // HTML template with placeholders
    const emailTemplate = `
    <!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Task Management System</title>
      <style>
        body {
          font-family: Segoe, 'Segoe UI', 'DejaVu Sans', 'Trebuchet MS', Verdana, sans-serif;
          background-color: #ededed;
        }
        table {
          width: 100%;
          height: 100%;
          background-color: #ffffff;
          margin: 10% auto !important;
          padding: 10px 20px 30px;
          box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
          border-collapse: collapse;
        }
        td {
          padding: 8px;
        }
        .header {
          border-bottom: 1px solid #e4e4e4;
          text-align: center;
        }
        .content {
          padding-top: 10px;
        }
      </style>
    </head>
    <body>
      <table>
        <tr>
          <td>
            <table>
              <tr>
                <td colspan="2" class="header"></td>
              </tr>
              <tr>
                <td colspan="2" class="content">Dear ${username},</td>
              </tr>
              <tr>
                <td colspan="2">
                  <p>Welcome! You have been successfully assigned a new task titled: <strong>${title}</strong>.</p>
                  <p>Thank you for being a part of our team.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>`;

    const mailOptions = {
      from: mailFrom,
      to,
      subject: "New Task Assignment",
      html: emailTemplate,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email", error);
      throw error;
    }
  }
}

export default new MailNotifier();
