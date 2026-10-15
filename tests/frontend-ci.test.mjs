import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const workflow = readFileSync(
  new URL('../.github/workflows/deploy.yml', import.meta.url),
  'utf8',
);
const testJob = workflow.split('  test:\n')[1].split('\n  build:')[0];
const buildJob = workflow.split('  build:\n')[1].split('\n  deploy:')[0];
const deployJob = workflow.split('  deploy:\n')[1];

test('CI uses Node 22 and runs the complete test script before publication', () => {
  assert.match(workflow, /push:\n {4}branches: \[main\]/);
  assert.match(workflow, /pull_request:\n {4}branches: \[main\]/);
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(testJob, /name: Frontend tests/);
  assert.match(testJob, /node-version: 22/);
  assert.match(testJob, /run: npm ci\n {6}- run: npm test/);
  assert.doesNotMatch(testJob, /head.repo.full_name/);
  assert.match(buildJob, /needs: test/);
  assert.match(deployJob, /needs: build/);
  assert.match(deployJob, /!cancelled\(\) && needs.build.result == 'success'/);
});

test('failed tests block publication; fork PRs never publish; close still cleans previews', () => {
  const condition = buildJob
    .match(/if: >-\n([\s\S]*?)\n {4}runs-on:/)[1]
    .trim();
  const evaluate = new Function(
    'github',
    'needs',
    'cancelled',
    `return (${condition});`,
  );
  for (const event of ['push', 'workflow_dispatch', 'pull_request']) {
    for (const result of ['success', 'failure', 'cancelled', 'skipped']) {
      const github = {
        event_name: event,
        repository: 'owner/repo',
        event: {
          action: 'synchronize',
          pull_request: { head: { repo: { full_name: 'owner/repo' } } },
        },
      };
      assert.equal(
        evaluate(github, { test: { result } }, () => false),
        result === 'success',
      );
      assert.equal(
        evaluate(github, { test: { result } }, () => true),
        false,
      );
      if (event === 'pull_request') {
        github.event.pull_request.head.repo.full_name = 'fork/repo';
        assert.equal(
          evaluate(github, { test: { result } }, () => false),
          false,
        );
      }
    }
  }
  const closed = {
    event_name: 'pull_request',
    repository: 'owner/repo',
    event: {
      action: 'closed',
      pull_request: { head: { repo: { full_name: 'owner/repo' } } },
    },
  };
  assert.equal(
    evaluate(closed, { test: { result: 'skipped' } }, () => false),
    true,
  );
  assert.match(testJob, /if: github.event.action != 'closed'/);
});
