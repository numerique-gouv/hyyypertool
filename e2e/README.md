# End to End tests

## Usage

```sh
# Because [Bun](https://github.com/oven-sh/bun/releases/tag/bun-v1.0.26) does not support cypress.
$ bun install
# Run all the test in headless mode
$ bun run test
# Run specific test file
$ bun run e2e:run test --spec="features/organizations/dinum.feature"
# Open cypress in electron
$ bun run open
```

## Test configuration

- [Default test configuration](https://github.com/badeball/cypress-cucumber-preprocessor/blob/master/docs/test-configuration.md)

## [Gherkin French Keyword](https://cucumber.io/docs/gherkin/languages/#gherkin-dialect-fr-content)

| English Keyword | French equivalent(s) |
| --------------- | -------------------- |
| feature         | Fonctionnalité       |
| background      | Contexte             |
| scenario        | Exemple              |
|                 | Scénario             |
| scenarioOutline | Plan du scénario     |
|                 | Plan du Scénario     |
| examples        | Exemples             |
| given           | \*                   |
|                 | Soit                 |
|                 | Sachant que          |
|                 | Sachant qu'          |
|                 | Sachant              |
|                 | Etant donné que      |
|                 | Etant donné qu'      |
|                 | Etant donné          |
|                 | Etant donnée         |
|                 | Etant donnés         |
|                 | Etant données        |
|                 | Étant donné que      |
|                 | Étant donné qu'      |
|                 | Étant donné          |
|                 | Étant donnée         |
|                 | Étant donnés         |
|                 | Étant données        |
| when            | \*                   |
|                 | Quand                |
|                 | Lorsque              |
|                 | Lorsqu'              |
| then            | \*                   |
|                 | Alors                |
|                 | Donc                 |
| and             | \*                   |
|                 | Et que               |
|                 | Et qu'               |
|                 | Et                   |
| but             | \*                   |
|                 | Mais que             |
|                 | Mais qu'             |
|                 | Mais                 |
| rule            | Règle                |
