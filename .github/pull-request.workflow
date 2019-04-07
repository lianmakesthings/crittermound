workflow "Pull Requests" {
  on = "pull_request"
  resolves = ["test"]
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
