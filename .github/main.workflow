workflow "Run tests only" {
  resolves = ["test"]
  on = "pull_request"
}

action "Build" {
  uses = "actions/npm@master"
  runs = "install"
}

action "test" {
  uses = "actions/npm@master"
  needs = ["Build"]
  runs = "test-all"
}

workflow "Test, Build & Deploy" {
  on = "push"
  resolves = ["GitHub Action for npm"]
}

action "setup" {
  uses = "actions/npm@master"
  runs = "install"
}

action "GitHub Action for npm" {
  uses = "actions/npm@master"
  needs = ["setup"]
  runs = "test-all"
}
