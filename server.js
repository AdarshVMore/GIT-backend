const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { google } = require("googleapis");

require("dotenv").config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Authenticate with Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: {
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

// Spreadsheet ID and range
const spreadsheetId = "1oJwt_MI0j5D030XfSvmE21uqRmppSJmvDHOaYCZ-HdQ";
const range = "Sheet1!A:D"; // Adjust the range according to your sheet

// POST route to save form data
app.post("/enquiry", async (req, res) => {
  const { fullname, phone, email, terms } = req.body;

  const newEntry = [fullname, phone, email, terms];

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      resource: {
        values: [newEntry],
      },
    });

    res.status(201).send("Enquiry saved to Google Sheet");
  } catch (error) {
    console.error("Error appending data to Google Sheet:", error);
    res.status(500).send("Error saving enquiry");
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
