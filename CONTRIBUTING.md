# Contributing

## Table of Contents
- [Mock Data](#mock-data)
- [Review Process](#review-process)
- [Git Standards](#git-standards)
  - [Commit Messages](#commit-messages)
    - [Length](#length)
    - [Grammar](#grammar)
    - [Format](#format)
      - [`<type>`](#type)
      - [`<scope>`](#scope)
      - [`<description>`](#description)
      - [`<body>`](#body)
      - [`<footer>`](#footer)
  - [Merge Requests](#merge-requests)
    - [Single-Commit](#single-commit)
    - [Multi-Commit](#multi-commit)

## Mock Data
Any change that adds new functionality or modifies existing functionality *must* add or modify mock data.  Merge requests that do not include mock data will be rejected.

## Review Process
All merge requests should be merged only by a senior developer.

## Git Standards
This section defines the git standards that must be followed by Customer Portal UI.

### Commit Messages
These commit message standards are inspired but adapted from the following sources (recommended reading):
- https://www.conventionalcommits.org
- https://github.com/bluejava/git-commit-guide
- http://karma-runner.github.io/3.0/dev/git-commit-msg.html

#### Length
The commit title must not exceed 80 characters.

#### Grammar
The imperative mood must be used throughout the commit description, e.g. "Add the README" instead of "Adds the README".  A good test for this is to complete the sentence: "Applying this commit will..."

#### Format
All commit messages must be structured as follows:
```
<type>(<scope>): <description>

<body>

<footer>
```
- [`<type>`](#type) is required
- [`(<scope>)`](#scope) is required if an applicable scope can be used
- [`<description>`](#description) is required
- [`<body>`](#body) is optional, but recommended
- [`<footer>`](#footer) is required if there is a corresponding CDETS, Jira, or Rally ticket

For example:
```
fix(day0): Autoscroll fully when popup extends document height

Before this change, opening a popup that increased the natural document
height would result in a partial autoscroll rather than a full
autoscroll.

After this change, the full autoscroll behavior works as intended.
Additionally, this change fixes the multiple scrollbar behavior that was
previously observed.

Closes F1234
```

##### `<type>`
The commit title `<type>` is required, and must be one of the options in this list:Different types of projects by nature may require use of different types.

| Type | Description |
|------|-------------|
| **feat** | - new feature/functionality |
| **fix** | - bug fix |
| **tweak** | small change (usually visual) that doesn't affect usability or functionality, e.g. label change |
| **refactor** | code refactor |
| **style** | style change in the UI, usually CSS |
| **docs** | documentation change |
| **test** | add or modify tests |
| **build** | build-related changes, usually webpack |
| **tool** | tool or utility-related changes, e.g. helper scripts |
| **deps** | dependency-related changes, e.g. bumping dependency version |
| **misc** | anything that doesn't fall easily into the above types |

If a lot of `misc` types begin showing up in a project, it's a sign that a new `<type>` should be added to this list.  Also note that if

##### `<scope>`
The commit title `<scope>` is required if an applicable scope can be used. Before being included in a commit, a scope *must* be defined in the list of project scopes.  This list can be seen below:
- framework
- day0
- lifecycle
- admin
- assets
  - assets/360
- adv
  - adv/sa
    - adv/sa/360
  - adv/fn
    - adv/fn/360
  - adv/pb
    - adv/pb/360
- prob-res
  - prob-res/rma
    - prob-res/rma/360
  - prob-res/oc
    - prob-res/rma/360
- ins
  - ins/sw
    - ins/sw/360
  - ins/rcc
    - ins/rcc/360

This list will most likely change over time as a project grows.

##### `<description>`
The commit `<description>` is required, and must summarize what the commit does without using the word "and".  Needing to use "and" indicates that the commit should be two separate commits.  Keep it short and sweet (remember the line limit of 72 characters).  The first character of the description should be capitalized as if it were the beginning of a sentence.

##### `<body>`
The commit `<body>` is optional but recommended, and must be preceded by a blank line.  Multiple paragraphs can be used (separated by blank lines).  Note that having multiple paragraphs breaks from the Conventional Commits spec.

##### `<footer>`
The commit footer is optional.  It should be used to include issue numbers from JIRA or GitHub that pertain to this commit.  The footer section must be preceded by a blank line.

For example:
```
Resolves F1234
Fixes CSCvr1234
```

Note the imperative mood doesn't need to be used here, since we are no longer describing what happens when the commit is applied in isolation.


### Merge Requests
- Before opening a merge request (MR), the source branch *must* be rebased and tested on top of the target branch
- All changes to the main branches of a project must be made via an MR

In general, an MR should have a single commit.  However, there are times when multi-commit MRs are more appropriate.  The following sections will describe how to choose between the two, along with their pros/cons and their review/merge processes.

#### Single-Commit
A single-commit MR is an MR that is opened with only one commit.  This should be the default choice.  Single-commit MRs should *always* have the "Squash commits" option selected when merging an MR.

> Note: At the time of merge, the "single-commit" MR may contain multiple commits as a result of the review process.  However at no point does it become a "multi-commit" MR.  Remember that a single-commit MR is defined as a MR that is **opened** with only one commit.

During the review process, it is recommended to push new revision commits rather than amending the `HEAD` commit.  This makes it easier for the reviewer to see the revisions in isolation.

Pros:
- Easy to see what was changed with revision commits
- Keeps the discussion in the MR focused on one logical change (assuming the commit is atomic)
- Flatter git history

Cons:
- Tedious and time consuming to create one MR per commit when many small commits
- Tedious and time consuming to open multiple MRs when one MR depends on another

#### Multi-Commit
A multi-commit MR is an MR that is opened with multiple commits.  The multiple commits must be atomic and useful on their own.  A good test for atomicity is to ask the question: "Would I want this commit title to show up in the changelog?"  If the answer is no, the commits should probably be squashed.

During the review process, any revisions *must* be amended to the relevant commit via `git rebase`.  Revisions should not be amended onto the `HEAD` commit unless they are relevant to the `HEAD` commit.

Pros:
- Easy to create one PR for many small commits
- Easy to create one PR when atomic commits have dependencies

Cons:
- Difficult to see what was changed with revision commits
- Extended review of one commit can block merging of an unrelated commit
- Bumpier git history
