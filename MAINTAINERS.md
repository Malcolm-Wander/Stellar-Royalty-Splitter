# Maintainer Guide

Guidelines for repository maintainers reviewing and merging pull requests.

## PR Review Checklist

### Before Approving Any PR

- [ ] **CI Status**: All workflows pass (Backend CI, Contract CI)
- [ ] **Code Quality**: No linting errors or new warnings
- [ ] **Tests**: All tests pass (100% success, no flakes)
- [ ] **Description**: PR has clear description of changes
- [ ] **Scope**: Changes align with issue description
- [ ] **No Conflicts**: Branch is up to date with main

### Code Review Process

#### Backend Changes

- [ ] Code follows ESLint rules
- [ ] No hardcoded secrets or credentials
- [ ] Error handling is present
- [ ] Logging is appropriate (not too verbose)
- [ ] Database queries are optimized
- [ ] New endpoints are documented in API.md
- [ ] Tests cover main code paths

#### Contract Changes

- [ ] Code follows Rust conventions
- [ ] Functions are properly documented
- [ ] Tests cover main logic
- [ ] No unsafe code without justification
- [ ] Cargo.lock is committed (no .gitignore modifications)
- [ ] Formatting passes (`cargo fmt --check`)

#### Documentation Changes

- [ ] Grammar and spelling correct
- [ ] Links are valid
- [ ] Code examples are tested
- [ ] Formatting is consistent

#### Configuration Changes

- [ ] Changes don't break reproducible builds
- [ ] Dependencies are pinned to specific versions
- [ ] No unnecessary breaking changes
- [ ] Backward compatibility preserved (if possible)

---

## Common Issues and Solutions

### CI Failure: "Backend CI / test (20.x) failed"

**Cause**: Test failure on Node 20.x

**Action**:

1. Check workflow logs for exact error
2. Ask contributor to fix locally:
   ```bash
   cd backend
   npm ci
   npm test
   ```
3. Request new commit with fixes

### CI Failure: "Contract CI / Test failed"

**Cause**: Rust test failure

**Action**:

1. Check logs for failing test
2. Ask contributor to reproduce locally:
   ```bash
   cargo test --workspace --locked --features testutils
   ```
3. Request fixes

### CI Failure: "ESLint failed"

**Cause**: Code style issues

**Action**:

1. Auto-fix and commit:
   ```bash
   cd backend
   npm run format
   git add .
   git commit -m "style: auto-format code"
   git push
   ```
2. Or ask contributor to run `npm run format`

### Merge Conflicts

**When PR has conflicts:**

1. Ask contributor to resolve:

   ```bash
   git fetch origin
   git rebase origin/main
   # Fix conflicts
   git add .
   git rebase --continue
   git push -f origin feature-branch
   ```

2. Or resolve for them:
   ```bash
   git checkout main
   git pull origin main
   git merge --no-ff origin/feature-branch
   # Fix conflicts
   git add .
   git commit -m "Merge branch 'feature-branch' into main"
   git push origin main
   ```

---

## Merging PRs

### Step 1: Final Check

```bash
# Pull the branch locally
git fetch origin
git checkout origin/feature-branch

# Verify CI passed
# Check GitHub for green checkmarks

# Optional: Run tests locally
cd backend && npm test
cd ../..
cargo test --workspace --locked --features testutils
```

### Step 2: Merge Strategy

**Recommended**: Squash and merge (clean history)

```bash
# GitHub UI: Select "Squash and merge"
# CLI:
git checkout main
git pull origin main
git merge --squash origin/feature-branch
git commit -m "feat: description from PR"
git push origin main
```

**Alternative**: Create merge commit (preserve history)

```bash
git merge --no-ff origin/feature-branch
git push origin main
```

### Step 3: Post-Merge

- [ ] Verify CI passes on main
- [ ] Monitor for any deployment issues
- [ ] Delete the branch:
  ```bash
  git push origin --delete feature-branch
  ```

---

## Release Process

### Before Release

1. Update version in `package.json` and `Cargo.toml`
2. Update `CHANGELOG.md`
3. Run full test suite
4. Create release branch

### Create Release

```bash
# Create release branch
git checkout -b release/v1.2.3

# Update versions
# Update CHANGELOG.md
git add .
git commit -m "chore: prepare release v1.2.3"
git push -u origin release/v1.2.3

# Create PR and merge
```

### Tag Release

```bash
git checkout main
git tag -a v1.2.3 -m "Release version 1.2.3"
git push origin v1.2.3

# Create GitHub release with tag
```

---

## Monitoring

### Daily Checks

- [ ] All main branch tests passing
- [ ] No blocked PRs waiting for review
- [ ] No stale branches (older than 2 weeks)

### Weekly Checks

- [ ] Review open issues for duplicates
- [ ] Check for security vulnerabilities in dependencies
- [ ] Update dependencies if needed:
  ```bash
  cd backend
  npm update
  npm audit fix
  ```

### Monthly Checks

- [ ] Review CI performance
- [ ] Analyze test failures
- [ ] Clean up old branches/tags
- [ ] Update contributing guidelines if needed

---

## Permission Management

### Code Review Permissions

Should have write access:

- Core maintainers (can merge)
- Backend team (can review backend)
- Contract team (can review contract)

Should have read access:

- All contributors
- Documentation reviewers

### Administration

Only repository owner should:

- Manage branch protection rules
- Manage repository settings
- Add/remove maintainers
- Archive/delete the repository

---

## Emergency Procedures

### Revert a Bad Merge

```bash
# Find the commit hash
git log --oneline main | head

# Revert it
git revert HEAD~0  # Adjust number based on position
git push origin main

# Or hard reset (only if not yet pushed)
git reset --hard HEAD~1
```

### Quick Hotfix

```bash
# Create hotfix branch
git checkout -b hotfix/critical-bug

# Make fix and test
cd backend && npm test

# Create and merge PR with urgency label
git push -u origin hotfix/critical-bug
# Create PR on GitHub, get approval, merge
```

### Production Incident

1. Create hotfix branch immediately
2. Fix issue
3. Merge with expedited review (verbal approval is okay in emergency)
4. Deploy and monitor
5. Document incident post-mortem

---

## Communication

### PR Comments

**Be constructive and kind:**

```
❌ Bad: "This code is wrong"
✅ Good: "This could be optimized by using X instead of Y. Here's why: [explanation]"

❌ Bad: "Just fix it"
✅ Good: "Could you run `npm run format` to fix the linting issues?"
```

### Blocking a PR

When rejecting or asking for changes:

- Always explain why
- Suggest improvements
- Offer to help if complex

### Praising Good Work

When you see great contributions:

- Thank the contributor
- Call out specific improvements
- Share in team meetings

---

## Resources

- [GitHub Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Semantic Versioning](https://semver.org)
- [Conventional Commits](https://www.conventionalcommits.org)
- [How to Review Code](https://google.github.io/eng-practices/review/reviewer/)
