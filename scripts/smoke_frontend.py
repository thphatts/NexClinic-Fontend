#!/usr/bin/env python3
"""Check the standalone runtime serves pages, revision and generated assets."""
from html.parser import HTMLParser
import sys
from urllib.request import urlopen


class Assets(HTMLParser):
    def __init__(self):
        super().__init__()
        self.paths = set()

    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key in ('src', 'href') and value and value.startswith('/_next/static/'):
                self.paths.add(value)


base, revision = sys.argv[1:]
parser = Assets()
for path in ('/', '/login', '/register'):
    with urlopen(base + path, timeout=15) as response:
        assert response.status == 200, path
        parser.feed(response.read().decode())
assert parser.paths, 'No generated JS/CSS found in rendered pages'
for path in parser.paths:
    with urlopen(base + path, timeout=15) as response:
        assert response.status == 200 and response.read(1), path
with urlopen(base + '/release.txt', timeout=15) as response:
    assert response.read().decode().strip() == revision, 'Wrong release served'
print(f'Pages, {len(parser.paths)} assets and revision verified')
