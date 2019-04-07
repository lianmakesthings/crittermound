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
  args = "IyEvdXNyL2Jpbi9lbnYgYmFzaAoKIyBkaWUgb24gZXJyb3IKc2V0IC1lCgojIGluc3RhbGwgdGhpbmdzCnN1ZG8gYXB0LWdldCBpbnN0YWxsIGN1cmwKCiMgaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vY2p1cy8xMDQ3Nzk0CmVjaG8gJ1JldHJpZXZpbmcgbGF0ZXN0IGRlcGxveS4uLicKdXJsPWBjdXJsIC1IICJBdXRob3JpemF0aW9uOiBCZWFyZXIgJE5FVExJRllfQVVUSF9UT0tFTiIgaHR0cHM6Ly9hcGkubmV0bGlmeS5jb20vYXBpL3YxL3NpdGVzLyR7TkVUTElGWV9TSVRFX0lEfS9kZXBsb3lzYAp0ZW1wPWBlY2hvICR1cmwgfCBzZWQgJ3MvXFxcXFwvL1wvL2cnIHwgc2VkICdzL1t7fV0vL2cnIHwgYXdrIC12IGs9InRleHQiICd7bj1zcGxpdCgkMCxhLCIsIik7IGZvciAoaT0xOyBpPD1uOyBpKyspIHByaW50IGFbaV19JyB8IHNlZCAncy9cIlw6XCIvXHwvZycgfCBzZWQgJ3MvW1wsXS8gL2cnIHwgc2VkICdzL1wiLy9nJyB8IGdyZXAgLXcgLW0gMSAnaWQnYAoKIyBodHRwczovL3d3dy5uZXRsaWZ5LmNvbS9kb2NzL2FwaS8jZGVwbG95cwplY2hvICJQdWJsaXNoaW5nIGJ1aWxkICR7dGVtcCMjKnx9Li4uIgpjdXJsIC1YIFBPU1QgLUggIkF1dGhvcml6YXRpb246IEJlYXJlciAkTkVUTElGWV9BVVRIX1RPS0VOIiAtZCAie30iICJodHRwczovL2FwaS5uZXRsaWZ5LmNvbS9hcGkvdjEvc2l0ZXMvJHtORVRMSUZZX1NJVEVfSUR9L2RlcGxveXMvJHt0ZW1wIyMqfH0vcmVzdG9yZSIKCiMgaHR0cHM6Ly9vcGVuLWFwaS5uZXRsaWZ5LmNvbS8jL2RlZmF1bHQvbG9ja0RlcGxveQplY2hvICJMb2NraW5nIGRlcGxveSB0byAke3RlbXAjIyp8fS4uLiIKY3VybCAtWCBQT1NUIC1IICJBdXRob3JpemF0aW9uOiBCZWFyZXIgJE5FVExJRllfQVVUSF9UT0tFTiIgLWQgInt9IiAiaHR0cHM6Ly9hcGkubmV0bGlmeS5jb20vYXBpL3YxL2RlcGxveXMvJHt0ZW1wIyMqfH0vbG9jayI="
  secrets = ["NETLIFY_AUTH_TOKEN"]
  env = {
    NETLIFY_SITE_ID = "ebf78c33-bf2b-4911-93b9-865347f37858"
  }
}
