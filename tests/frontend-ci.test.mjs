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
  assert.match(buildJob, /needs: \[test, biome\]/);
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
      for (const biomeResult of [
        'success',
        'failure',
        'cancelled',
        'skipped',
      ]) {
        const github = {
          event_name: event,
          repository: 'owner/repo',
          event: {
            action: 'synchronize',
            pull_request: { head: { repo: { full_name: 'owner/repo' } } },
          },
        };
        assert.equal(
          evaluate(
            github,
            { test: { result }, biome: { result: biomeResult } },
            () => false,
          ),
          result === 'success' && biomeResult === 'success',
        );
        assert.equal(
          evaluate(
            github,
            { test: { result }, biome: { result: biomeResult } },
            () => true,
          ),
          false,
        );
        if (event === 'pull_request') {
          github.event.pull_request.head.repo.full_name = 'fork/repo';
          assert.equal(
            evaluate(
              github,
              { test: { result }, biome: { result: biomeResult } },
              () => false,
            ),
            false,
          );
        }
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
    evaluate(
      closed,
      { test: { result: 'skipped' }, biome: { result: 'skipped' } },
      () => false,
    ),
    true,
  );
  assert.match(testJob, /if: github.event.action != 'closed'/);
});

test('Biome checks run separately for all PRs and report both failures', () => {
  const biomeJob = workflow.split('  biome:\n')[1].split('\n  test:')[0];
  assert.match(biomeJob, /name: Biome \$\{\{ matrix.command \}\}/);
  assert.match(biomeJob, /if: github.event.action != 'closed'/);
  assert.match(biomeJob, /fail-fast: false/);
  assert.match(biomeJob, /command: \[lint, 'format:check'\]/);
  assert.match(biomeJob, /node-version: 22/);
  assert.match(
    biomeJob,
    /run: npm ci\n {6}- run: npm run \$\{\{ matrix.command \}\}/,
  );
  assert.doesNotMatch(biomeJob, /continue-on-error|head.repo.full_name/);
});
