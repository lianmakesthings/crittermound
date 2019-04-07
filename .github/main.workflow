workflow "Tests only" {
  resolves = ["Test"]
  on = "pull_request"
}

workflow "Test, Build & Deploy" {
  on = "push"
  resolves = ["bash"]
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

action "bash" {
  uses = "bash"
  needs = ["Build"]
  args = "IyEvdXNyL2Jpbi9lbnYgYmFzaAoKIyBkaWUgb24gZXJyb3IKc2V0IC1lCgojIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2NqdXMvMTA0Nzc5NAplY2hvICdSZXRyaWV2aW5nIGxhdGVzdCBkZXBsb3kuLi4nCnVybD1gY3VybCAtSCAiQXV0aG9yaXphdGlvbjogQmVhcmVyICRORVRMSUZZX0FVVEhfVE9LRU4iIGh0dHBzOi8vYXBpLm5ldGxpZnkuY29tL2FwaS92MS9zaXRlcy8ke05FVExJRllfU0lURV9JRH0vZGVwbG95c2AKdGVtcD1gZWNobyAkdXJsIHwgc2VkICdzL1xcXFxcLy9cLy9nJyB8IHNlZCAncy9be31dLy9nJyB8IGF3ayAtdiBrPSJ0ZXh0IiAne249c3BsaXQoJDAsYSwiLCIpOyBmb3IgKGk9MTsgaTw9bjsgaSsrKSBwcmludCBhW2ldfScgfCBzZWQgJ3MvXCJcOlwiL1x8L2cnIHwgc2VkICdzL1tcLF0vIC9nJyB8IHNlZCAncy9cIi8vZycgfCBncmVwIC13IC1tIDEgJ2lkJ2AKCiMgaHR0cHM6Ly93d3cubmV0bGlmeS5jb20vZG9jcy9hcGkvI2RlcGxveXMKZWNobyAiUHVibGlzaGluZyBidWlsZCAke3RlbXAjIyp8fS4uLiIKY3VybCAtWCBQT1NUIC1IICJBdXRob3JpemF0aW9uOiBCZWFyZXIgJE5FVExJRllfQVVUSF9UT0tFTiIgLWQgInt9IiAiaHR0cHM6Ly9hcGkubmV0bGlmeS5jb20vYXBpL3YxL3NpdGVzLyR7TkVUTElGWV9TSVRFX0lEfS9kZXBsb3lzLyR7dGVtcCMjKnx9L3Jlc3RvcmUiCgojIGh0dHBzOi8vb3Blbi1hcGkubmV0bGlmeS5jb20vIy9kZWZhdWx0L2xvY2tEZXBsb3kKZWNobyAiTG9ja2luZyBkZXBsb3kgdG8gJHt0ZW1wIyMqfH0uLi4iCmN1cmwgLVggUE9TVCAtSCAiQXV0aG9yaXphdGlvbjogQmVhcmVyICRORVRMSUZZX0FVVEhfVE9LRU4iIC1kICJ7fSIgImh0dHBzOi8vYXBpLm5ldGxpZnkuY29tL2FwaS92MS9kZXBsb3lzLyR7dGVtcCMjKnx9L2xvY2si"
  secrets = ["NETLIFY_AUTH_TOKEN"]
  env = {
    NETLIFY_SITE_ID = "ebf78c33-bf2b-4911-93b9-865347f37858"
  }
}
