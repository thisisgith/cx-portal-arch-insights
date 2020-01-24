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
- [Coding Standards](#coding-standards)
	- [HTML](#html)
	- [Javascript/Typescript](#javascripttypescript)
	- [SCSS & CSS](#scss-css)
	- [A11y](#a11y)

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
The commit title and body lines must not exceed 80 characters.

#### Grammar
Please use proper grammer, including correct spelling and capitalization. The past tense should be used with your message title. "Added error logs for server...". This way when looking through the git history it will read like a history. If in the commit body you have to use an unrecognized word or file name please use \`backticks\` to avoid the spell checker flagging that word. 


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


## Coding Standards
This page defines the code styling guidelines that must be followed within CX frontend development.  This is a living document, so please feel free to make a pull request if there is inconsistent or missing information.

> Note: Any changes to a project's TSLint configuration should be propagated back to this document, and all other projects' TSLint configurations should be updated to match. The overall TSLint config file can be found here [in the lint config file](./utils/lint/ts/index.js)

### HTML
All HTML should be valid markup. Meaning all tags should have a closing tag (unless it is self-closing). Element ID's should only be used once per page. Best Practices should be followed, and allow for best practices when considering `a11y`. They are as following:


- Semantic HTML practices should always be followed.
- An `<a />` tag should always have an HREF and should never be used as a button simply to inherit the style. HREFS should never be blank.
- `<div />`s and `<span />`s are the elements of last resort. All other semantic elements should be considered before their use. They are meaningless semantically.
- `<div />`s should never contain text alone. There are text elements for this.
- `<div />`s should never have user interactive events attached to them. OnClicks, should be reserved for interactive elements like `<button />`s.
-  As a coding style convention we are using the one attribute per line style of JSX and more closely AirBnB's config. 
References to the style can be found here on the [AirBnb website](https://airbnb.io/javascript/react/#alignment) The reason for this is that it lends itself to greater reability and easier maintenance by other developers.

*Example:*
```
// Bad practice
<button (click)="clickOnThing()" [ngClass]="{ 'button--disabled': thing.disabled }" [innerText]="button.text"
></button>

// Good practice
<button 
  (click)="clickOnThing()"
  [ngClass]="{ 'button--disabled': thing.disabled }"
  [innerText]="button.text"
>
  {{ text }}
</button>

// Good Practice
<button class="one-attribute-okay">
  {{ text }}
</button>
```


- Element IDs should almost never be used. Use classes instead. This will allow for reusability. Conditions where classes should be used are in the cases of Form elements needing labels and the use of anchors in documents to be linked to by a url or and HREF.


### Javascript/Typescript
All type script should be linted by TSLint. We use the basic `tslint-config-airbnb` with some modifications. The config is a port of the AirBnB style guide for Javascript which can be viewed here on the [AirBnB website](https://github.com/airbnb/javascript). To view them all in detail you can do so here in the [Linting config file](./utils/lint/ts/index.js). Some common rules that were modified are:

- No trailing white spaces. This helps in Git diffs as whitespace changes will not show a change.
- Always have a trailing comma. Again this helps in Git diffs as only one line will look to be changed if another property is added.
- Do not include unneeded docs. Some docs don’t add value and are a pain to develop to read and to maintain. This in turn means it’s up to code reviewers to request docs when it is necessary. Basically if you need to reread a method more than once or you go “huh” then maybe a doc is needed (or even better request something cleaner).
- Line length should be below 140 characters. This is an extreme in most cases you can aim for under 100.
*Example:*
```
// Bad practice
if (this.thingTruthy() && helloVar == 6 || this.otherThingFalsy() && helloVar == 8 || this.nothingFalsy()) {
    ...
  }
// Good practice
if (this.thingTruthy() && helloVar == 6
  || this.otherThingFalsy() && helloVar == 8
  || this.nothingFalsy() && !goodByeVar) {
    ...
}

// Cleaner practice -- though please use more descriptive naming
const conditionOne = this.thingTruthy() && helloVar == 6;
const conditionTwo = this.otherThingFalsy() && helloVar == 8;
const conditionThree = this.nothingFalsy() && !goodByeVar;

if (conditionOne || conditionTwo || conditionThree) {
  ...
}
```

Other things to keep in mind:
- File sizes should be kept between **<800 lines**. Eight hundred being the top limit and should be considered huge. **Aim for 250-500**.
- All variables, properties, parameters, methods and functions should have human readable names. This will allow for better readability and maintainability. You may know at the time what these things will mean but three months from now you probably won't. Just imagine how the next developer will have to decipher it. If you see this in code review please ask for a clean human reabable name.
```
// Bad practice and unreadable
const namelessNonsense = thing.map(b => {
  const c = { ...b };
  let w = c.m + c.d;
  c.x = w / c.y;
  return c.
});
```

### SCSS & CSS
We are implementing and using BEM. The Block-Element-Modifier (BEM) specification for naming CSS classes.  The default format for this convention is `.block__element--modifier`. You can see the standard from the creators here on the official [BEM website](https://en.bem.info/methodology/quick-start/). Although we have Angular's scoped styles BEM is a naming convention we prefer.

Some common problems people have are nesting Elements based on the DOM. This is not good practice and recommended against in the docs above and specifically here on the official [BEM website](https://en.bem.info/methodology/html/#nesting-of-elements).

BEM is not BEEEEEEEM

Some General SCSS/CSS best practices are:
- **!important** is the worst thing you can do to a stylesheet. If a project is littered with **!important**s It will soon become maintainable. **!important** is your very last option and everytime it is implemented it should be understood as `Tech Debt`
- IDs should not be used unless specifically needed for a page anchor tag or a form element for a label.
*In both of the above cases class specificity should be a better option.
- Nesting of SCSS provides better readbaility and less code to try to decipher for the next developer. If we are using proper BEM and specific naming conventions (and proper components in small file sizes) the name of the block should be an easy enough identifier to find in the code. In the best case one file per component and one file per SCSS with one BEM Block.

```
.hello-component {
  flex: 1;

    &__title {
      color: red;

      &--highlight {
        color: blue;
      }
    }

    &__description {
      color: black;
    }
}
```
- The use of `@mixin` is preffered over `@extends`

### A11y
Accessibility **(A11y)** should be considered in all of the development process. Cisco and the CX team are implementing the WCAG 2.0 AA standards. You can read more about it on the [WCAG website](https://www.w3.org/WAI/standards-guidelines/wcag/).

Some basic standards are:
- Keyboard navigation is a must. 
- Visual indicators cannot rely on colour alone.
- You should never disable the `:focus` visual indicator on an element totally.
There are many many more. If you need training on Accessibility please contact your lead. But a good place to start would be this [video tutorial on Accessibility](https://www.pluralsight.com/courses/web-accessibility-meeting-guidelines)