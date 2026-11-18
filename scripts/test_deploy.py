#!/usr/bin/env python3
"""Exercise frontend rollout and rollback without touching production."""
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / 'deploy/ec2-frontend-deploy.sh'
IMAGE = 'ghcr.io/test/frontend@sha256:' + 'a' * 64
REVISION = 'c' * 40


class DeployTests(unittest.TestCase):
    def rollout(self, mode, image=IMAGE):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            bin_dir = root / 'bin'
            bin_dir.mkdir()
            for name in ('compose.yaml', 'compose.override.yaml', 'compose.proxy-network.yaml', '.env'):
                (root / name).write_text('')
            for name, body in {
                'flock': '#!/bin/sh\nexit 0\n',
                'sleep': '#!/bin/sh\nexit 0\n',
                'curl': '''#!/bin/sh
printf 'curl %s\\n' "$*" >> "$DEPLOY_DIR/commands"
[ "$MODE" != tls_failure ] || exit 60
[ "$MODE" != homepage_failure ] || exit 22
case "$*" in
  *"release.txt"*)
    if [ "$MODE" = wrong_revision ]; then echo old-revision; else echo "$REVISION"; fi ;;
esac
''',
                'docker': '''#!/bin/sh
printf '%s\\n' "$*" >> "$DEPLOY_DIR/commands"
case "$*" in
  *"config --quiet"*) [ "$MODE" != config_failure ] ;;
  *"ps -q frontend"*) echo frontend-container ;;
  *"inspect --format {{.Image}}"*) echo sha256:old-image ;;
  *"org.opencontainers.image.revision"*) echo "$REVISION" ;;
  *"pull frontend"*) [ "$MODE" != pull_failure ] ;;
  *"up -d"*)
    if [ "$FRONTEND_IMAGE" != nexclinic-frontend:rollback ] && [ "$MODE" = health_failure ]; then exit 1; fi ;;
  *"nginx -s reload"*)
    if [ "$FRONTEND_IMAGE" != nexclinic-frontend:rollback ] && [ "$MODE" = reload_failure ]; then exit 1; fi ;;
esac
''',
            }.items():
                path = bin_dir / name
                path.write_text(body)
                path.chmod(0o755)
            env = dict(os.environ, DEPLOY_DIR=tmp, STACK_DIR=tmp,
                       PATH=str(bin_dir) + ':' + os.environ['PATH'], MODE=mode, REVISION=REVISION,
                       FRONTEND_HOST='portal.example.test')
            result = subprocess.run(['bash', str(SCRIPT), image], env=env, capture_output=True, text=True)
            commands = root / 'commands'
            release = root / 'frontend-release.env'
            return result, commands.read_text() if commands.exists() else '', release.read_text() if release.exists() else ''

    def test_success(self):
        result, commands, release = self.rollout('success')
        self.assertEqual(0, result.returncode, result.stderr)
        self.assertIn(IMAGE, release)
        self.assertIn('compose.proxy-network.yaml', commands)
        self.assertIn('--no-build --pull never --no-deps --wait', commands)
        self.assertIn('nginx -s reload', commands)
        self.assertNotIn('down', commands)
        self.assertIn('--resolve portal.example.test:443:127.0.0.1', commands)
        self.assertIn('https://portal.example.test/', commands)
        self.assertIn('https://portal.example.test/release.txt', commands)
        self.assertIn('--noproxy *', commands)
        self.assertNotIn('proxy wget', commands)
        self.assertNotIn('--insecure', commands)
        self.assertNotIn('--no-check-certificate', commands)

    def test_configuration_and_pull_failure_do_not_replace_container(self):
        for mode in ('config_failure', 'pull_failure'):
            with self.subTest(mode=mode):
                result, commands, release = self.rollout(mode)
                self.assertNotEqual(0, result.returncode)
                self.assertNotIn('up -d', commands)
                self.assertEqual('', release)

    def test_failure_restores_previous_image_and_reloads_proxy(self):
        for mode in ('health_failure', 'reload_failure', 'wrong_revision', 'tls_failure', 'homepage_failure'):
            with self.subTest(mode=mode):
                result, commands, release = self.rollout(mode)
                self.assertNotEqual(0, result.returncode)
                self.assertIn('Previous frontend restored', result.stderr)
                self.assertIn('image tag sha256:old-image nexclinic-frontend:rollback', commands)
                self.assertEqual('', release)

    def test_invalid_digest_is_rejected_before_docker(self):
        result, commands, _ = self.rollout('success', image='frontend:latest')
        self.assertNotEqual(0, result.returncode)
        self.assertEqual('', commands)


if __name__ == '__main__':
    unittest.main()
