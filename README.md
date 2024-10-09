# TAG Review Helper

This is a browser extension for W3C Technical Architecture Group (TAG) members that enhances the GitHub Web UI when working on design reviews.

It surfaces internal/draft review comments when visiting the public design review threads, bringing the discussion together into one place.

## Installing

For now, you need to do this manually.

* Clone this repo.

* Manually sideload the `extension/` directory.

  - **Firefox:** [Temporary installation in Firefox](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/)

  - **Chrome:** [Load an unpacked extension](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked)

  - **Edge:** [Sideload an extension](https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/getting-started/extension-sideloading)

  **Note:** Due to cross-browser differences, when loading the extension, you will get a warning about one of the keys in the manifest file. That's to be expected; any further errors being reported are bugs :-).

## Prerequisites for use

You need to be logged in to a GitHub account that has TAG member access to the [`w3ctag` organisation](https://github.com/w3ctag).

## How to use it

* Visit a design review thread (i.e. any issue under <https://github.com/w3ctag/design-reviews/issues/>).

* You will find an extra section, just before the original opening comment. This section contains a link to the internal thread for the review, and expandable copies of the internal/draft comments, if there are any.
