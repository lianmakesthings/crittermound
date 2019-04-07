workflow "Tests only" {
  resolves = ["Test"]
  on = "pull_request"
}

workflow "Test, Build & Deploy" {
  resolves = ["Build"]
  on = "push"
}

action "Setup" {
  uses = "actions/npm@master"
  runs = "install"
}

action "Test" {
  uses = "actions/npm@master"
  needs = ["Setup"]
  runs = "test-all"
}

action "Build" {
  uses = "actions/npm@master"
  needs = ["Test"]
  runs = "build"
}
