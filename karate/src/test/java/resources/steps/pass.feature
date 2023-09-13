Feature: Sample Karate Tests that all pass

  Background:
    * def firstNames = ['Mark','Alex','Ryan']

  Scenario Outline:
    * match firstNames contains '<name>'

    Examples: 
      | name |
      | Mark |
      | Alex |
      | Ryan |