workflow "Test, Build & Deploy" {
  resolves = ["Publish"]
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

action "Publish" {
  uses = "lafernando/github-action-bash/@master"
  needs = ["Build"]
  args = "IyEvdXNyL2Jpbi9lbnYgYmFzaAoKIyBkaWUgb24gZXJyb3IKc2V0IC1lCgojIGluc3RhbGwgdGhpbmdzCmFwdC1nZXQgLS1hc3N1bWUteWVzIGluc3RhbGwgY3VybAoKIyBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9janVzLzEwNDc3OTQKZWNobyAnUmV0cmlldmluZyBsYXRlc3QgZGVwbG95Li4uJwp1cmw9YGN1cmwgLUggIkF1dGhvcml6YXRpb246IEJlYXJlciAkTkVUTElGWV9BVVRIX1RPS0VOIiBodHRwczovL2FwaS5uZXRsaWZ5LmNvbS9hcGkvdjEvc2l0ZXMvJHtORVRMSUZZX1NJVEVfSUR9L2RlcGxveXNgCnRlbXA9YGVjaG8gJHVybCB8IHNlZCAncy9cXFxcXC8vXC8vZycgfCBzZWQgJ3MvW3t9XS8vZycgfCBhd2sgLXYgaz0idGV4dCIgJ3tuPXNwbGl0KCQwLGEsIiwiKTsgZm9yIChpPTE7IGk8PW47IGkrKykgcHJpbnQgYVtpXX0nIHwgc2VkICdzL1wiXDpcIi9cfC9nJyB8IHNlZCAncy9bXCxdLyAvZycgfCBzZWQgJ3MvXCIvL2cnIHwgZ3JlcCAtdyAtbSAxICdpZCdgCgojIGh0dHBzOi8vd3d3Lm5ldGxpZnkuY29tL2RvY3MvYXBpLyNkZXBsb3lzCmVjaG8gIlB1Ymxpc2hpbmcgYnVpbGQgJHt0ZW1wIyMqfH0uLi4iCmN1cmwgLVggUE9TVCAtSCAiQXV0aG9yaXphdGlvbjogQmVhcmVyICRORVRMSUZZX0FVVEhfVE9LRU4iIC1kICJ7fSIgImh0dHBzOi8vYXBpLm5ldGxpZnkuY29tL2FwaS92MS9zaXRlcy8ke05FVExJRllfU0lURV9JRH0vZGVwbG95cy8ke3RlbXAjIyp8fS9yZXN0b3JlIgoKIyBodHRwczovL29wZW4tYXBpLm5ldGxpZnkuY29tLyMvZGVmYXVsdC9sb2NrRGVwbG95CmVjaG8gIkxvY2tpbmcgZGVwbG95IHRvICR7dGVtcCMjKnx9Li4uIgpjdXJsIC1YIFBPU1QgLUggIkF1dGhvcml6YXRpb246IEJlYXJlciAkTkVUTElGWV9BVVRIX1RPS0VOIiAtZCAie30iICJodHRwczovL2FwaS5uZXRsaWZ5LmNvbS9hcGkvdjEvZGVwbG95cy8ke3RlbXAjIyp8fS9sb2NrIg=="
  secrets = ["NETLIFY_AUTH_TOKEN"]
  env = {
    NETLIFY_SITE_ID = "ebf78c33-bf2b-4911-93b9-865347f37858"
  }
}
