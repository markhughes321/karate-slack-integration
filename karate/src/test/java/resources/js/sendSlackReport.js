const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

/**
 * Configuration settings for the script.
 */
const CONFIG = {
    envPath: '.env', 
    textFilePath: 'karate/target/karate-reports/karate-summary-json.txt',
    zipFilePath: 'karate/target/cucumber-reports.zip',
    slackApiPostMessageUrl: 'https://slack.com/api/chat.postMessage',
    slackFileUploadUrl: 'https://slack.com/api/files.upload'
};

// Load environment variables from the .env file
require('dotenv').config({ path: CONFIG.envPath });
const slackToken = process.env.SLACK_TOKEN;
const slackChannel = process.env.SLACK_CHANNEL;
const slackHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${slackToken}`
};

/**
 * Constructs the message blocks for Slack notifications.
 * @param {Object} jsonData - The parsed report JSON data.
 * @returns {Object[]} An array of Slack block message objects.
 */
function buildMessageBlocks(jsonData) {
    const runStatus = jsonData.scenariosfailed >= 1 ? "Failed ⓧ" : "Passed ✓";
    return [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": `Test Suite ${runStatus}`,
                "emoji": true
            }
        },
        {
            "type": "section",
            "fields": [
                { "type": "mrkdwn", "text": `*Environment:*\n${jsonData.env}` },
                { "type": "mrkdwn", "text": `*Total Time:*\n${(jsonData.totalTime / 1000).toFixed(2)} secs` },
                { "type": "mrkdwn", "text": `*Features Passed:*\n${jsonData.featuresPassed}` },
                { "type": "mrkdwn", "text": `*Features Failed:*\n${jsonData.featuresFailed}` },
                { "type": "mrkdwn", "text": `*Features Passed:*\n${jsonData.scenariosPassed}` },
                { "type": "mrkdwn", "text": `*Features Failed:*\n${jsonData.scenariosfailed}` }
            ]
        }
    ];
}

/**
 * Sends a notification to Slack.
 * @param {Object} slackData - The data to send to Slack.
 * @returns {Promise<Object>} The response from Slack API.
 */
async function sendSlackNotification(slackData) {
    try {
        const response = await axios.post(CONFIG.slackApiPostMessageUrl, slackData, { headers: slackHeaders });
        return response.data;
    } catch (err) {
        console.error("Error in sendSlackNotification:", err.message);
        if (err.response && err.response.data) {
            console.error("Slack API Error Response:", err.response.data);
        }
        throw err;
    }
}

/**
 * Uploads a file to Slack as a threaded message.
 * @param {string} thread_ts - The timestamp of the parent message.
 * @returns {Promise<Object>} The response from Slack API.
 */
async function sendFileToSlack(thread_ts) {
    const form = new FormData();
    form.append('file', fs.createReadStream(CONFIG.zipFilePath));
    form.append('channels', slackChannel);
    form.append('thread_ts', thread_ts);

    const headers = {
        ...slackHeaders,
        ...form.getHeaders()
    };
    delete headers['Content-Type'];  // Let axios set this automatically based on form data

    try {
        const response = await axios.post(CONFIG.slackFileUploadUrl, form, { headers: headers });
        return response.data;
    } catch (err) {
        console.error("Error in sendFileToSlack:", err.message);
        if (err.response && err.response.data) {
            console.error("Slack API Error Response:", err.response.data);
        }
        throw err;
    }
}

/**
 * Creates and sends a Slack report and then uploads a file as a threaded message.
 * @param {string} textFilePath - The path to the report text file.
 */
async function createSlackReport(textFilePath) {
    try {
        if (!slackToken || !slackChannel) {
            throw new Error("SLACK_TOKEN and SLACK_CHANNEL not found. Check that your .env file and file path is correct");
        }

        const textData = fs.readFileSync(textFilePath, 'utf8');
        const jsonData = JSON.parse(textData);

        if (!jsonData) {
            throw new Error("Failed to parse JSON data from the report file.");
        }

        const mainMessageBlocks = buildMessageBlocks(jsonData);
        const slackResponse = await sendSlackNotification({
            "channel": slackChannel,
            "blocks": mainMessageBlocks
        });

        // If Slack response is successful and has a 'ts' timestamp, send the file as a threaded message
        if (slackResponse && slackResponse.ok && slackResponse.ts) {
            await sendFileToSlack(slackResponse.ts);
        }
    } catch (err) {
        console.error("Error in createSlackReport:", err.message);
    }
}

// Entry point
(async () => {
    try {
        await createSlackReport(CONFIG.textFilePath);
    } catch (err) {
        console.error(err.message);  // Only log the message property of the error
    }
})();
