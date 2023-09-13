Feature: Sample Karate Tests that all fail

  Background:
    * def firstNames = ['Mark','Alex','Ryan']

  Scenario Outline:
    * match firstNames contains '<name>'

    Examples: 
      | name  |
      | Liam  |
      | Brian |
      | Matt  |