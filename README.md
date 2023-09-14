# Karate DSL Cucumber Reports Integration with Slack

Streamline your test feedback loop by integrating Karate DSL Cucumber reports with your Slack channel.

<img width="587" alt="image" src="https://github.com/markhughes321/karate-slack-integration/assets/9667977/5dcbf270-d137-4c95-99aa-86405ccd6e49">

## Description

In today's agile development environment, getting real-time feedback is crucial. This project bridges the gap between test execution and team communication by pushing Karate DSL Cucumber reports directly into a Slack channel.

## Prerequisites

- Maven (for running the Karate tests)
- Slack app with necessary permissions and a dedicated channel
- npm modules: `fs`, `axios`, `path`, and `dotenv`

## Setup and Configuration

1. **Dependencies**: Ensure Maven is installed.
2. **Slack Setup**: 
    - Create a Slack App
    - Add the OAuth Scopes chat:write and files:write
    - Add the App to your slack channel 
3. **Environment Setup**:
    - Install the required npm modules.
    - Set up a `.env` file with your Bot User OAuth Token (SLACK_TOKEN) and channelID (SLACK_CHANNEL). See example.env for reference.

## Running the Project

1. Clone the project directory from your terminal.
`git clone https://github.com/markhughes321/karate-slack-integration`
2. Install the projects dependencies.
`npm install`
3. Execute the Karate tests and send the results to Slack.
`npm run karate:slack`

## Customization

The project is designed to be adaptable. Modify configurations, test scenarios, or Slack message formats as per your needs.

## Contributions and Feedback

Your contributions and feedback are always welcome! Feel free to raise issues or submit pull requests.

## License

ISC