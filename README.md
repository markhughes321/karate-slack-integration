# Karate DSL Cucumber Reports Integration with Slack

Streamline your test feedback loop by integrating Karate DSL Cucumber reports with your Slack channel.

## Description

In today's agile development environment, getting real-time feedback is crucial. This project bridges the gap between test execution and team communication by pushing Karate DSL Cucumber reports directly into a Slack channel.

## Prerequisites

- Maven (for running the Karate tests)
- Slack app with necessary permissions and a dedicated channel
- npm modules: `fs`, `axios`, `path`, and `dotenv`

## Setup and Configuration

1. **Dependencies**: Ensure Maven is installed.
2. **Slack Setup**: Create a Slack app, set up the necessary permissions, and integrate it into your channel.
3. **Environment Setup**:
    - Install the required npm modules.
    - Set up a `.env` file with Slack tokens and channel IDs.

## Running the Project

1. Navigate to the project directory in your terminal or command prompt.
2. Run the following command to execute the Karate tests:
`npm run karate`
3. To execute the tests and send the results to Slack, use:
`npm run karate:slack`

## Customization

The project is designed to be adaptable. Modify configurations, test scenarios, or Slack message formats as per your needs.

## Contributions and Feedback

Your contributions and feedback are always welcome! Feel free to raise issues or submit pull requests.

## License

ISC