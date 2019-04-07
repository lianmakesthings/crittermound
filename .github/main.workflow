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
  args = "install"
}

action "Test" {
  uses = "actions/npm@master"
  needs = ["Setup"]
  args = "run test-all"
}

action "Build" {
  uses = "actions/npm@master"
  needs = ["Test"]
  args = "run build"
}
