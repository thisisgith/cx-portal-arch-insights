# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] as of 05/13/2019
### Added
- Temporary Assets Table created from mock-ups

### Changed
- Moved to @cui-x-views/mock@1.1.0-beta for mocking [@joslaugh]

### Security
- Allowed CI audit to fail due to errors in:
	- @apollo/configs > @compodoc/compodoc > @compodoc/ngd-transformer > dot (Not fixed yet)
	- @angular-devkit/build-angular > node-sass > node-gyp > tar (Not fixed yet)
