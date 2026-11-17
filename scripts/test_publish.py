#!/usr/bin/env python3
"""Guard against exporting a local RepoDigest instead of the pushed GHCR repo."""
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

WORKFLOW = Path(__file__).resolve().parents[1] / '.github/workflows/frontend-ci.yml'
REMOTE = 'ghcr.io/test/frontend@sha256:' + 'a' * 64
LOCAL = 'nexclinic-frontend@sha256:' + 'b' * 64


class PublishTests(unittest.TestCase):
    def test_ghcr_digest_selection(self):
        block = WORKFLOW.read_text().split('          repo_digests=', 1)[1].split('\n  deploy:', 1)[0]
        script = 'repo_digests=' + '\n'.join(line[10:] if index else line for index, line in enumerate(block.splitlines()))
        for digests, succeeds in [(LOCAL + '\n' + REMOTE, True), (REMOTE + '\n' + LOCAL, True),
                                  (LOCAL, False), ('ghcr.io/test/frontend@sha256:bad', False)]:
            with self.subTest(digests=digests), tempfile.TemporaryDirectory() as tmp:
                root = Path(tmp)
                docker = root / 'docker'
                docker.write_text('#!/bin/sh\nprintf \'%s\\n\' "$TEST_DIGESTS"\n')
                docker.chmod(0o755)
                output = root / 'output'
                env = dict(os.environ, PATH=tmp + ':' + os.environ['PATH'],
                           image='ghcr.io/test/frontend', GITHUB_SHA='fixture', GITHUB_OUTPUT=str(output),
                           TEST_DIGESTS=digests)
                result = subprocess.run(['bash', '-e', '-o', 'pipefail', '-c', script],
                                        env=env, capture_output=True, text=True)
                self.assertEqual(succeeds, result.returncode == 0, result.stderr)
                if succeeds:
                    self.assertEqual('image=' + REMOTE + '\n', output.read_text())
                else:
                    self.assertFalse(output.exists())


if __name__ == '__main__':
    unittest.main()
