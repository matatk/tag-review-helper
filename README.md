# TAG Review Helper

This is a browser extension for W3C Technical Architecture Group (TAG) members that enhances the GitHub Web UI when working on design reviews.

It surfaces internal/draft review comments when visiting the public design review threads, bringing the discussion together into one place.

## Prerequisites for use

* You need to have a GitHub account that has TAG member access to the [`w3ctag` organisation](https://github.com/w3ctag).

* You need to create a Personal Access Token, which the extension uses to query the GitHub API (to get the internal review comments relating to a given design review). The extension will guide you through this when it's installed.

## Installing

For now, you need to do this manually.

* Clone this repo.

* Manually sideload the `extension/` directory.

  - **Firefox:** [Temporary installation in Firefox](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/)

  - **Chrome:** [Load an unpacked extension](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked)

  - **Edge:** [Sideload an extension](https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/getting-started/extension-sideloading)

  **Note:** Due to cross-browser differences, when loading the extension, you will get a warning about one of the keys in the manifest file. That's to be expected; any further errors being reported are bugs :-).

* As mentioned above, you will be guided through the process of creating and using your Personal Access Token.

## How to use it

* Visit a design review thread (i.e. any issue under <https://github.com/w3ctag/design-reviews/issues/>).

* You will find an extra section, just before the original opening comment. This section contains a link to the internal thread for the review, and expandable copies of the internal/draft comments, if there are any.

## If something goes wrong

If, or when, GitHub changes its page design, the extension may not be able to find the intended part of the page to place its output. If this happens, it will put its output right at the very start of the page. Not pretty, but you'll at least still be able to access the internal comments together with the main thread, whilst this extension gets fixed :-).

Due to the use of the GitHub API (as of version 0.1.0) the extension should be much more stable, as it's not relying on page layout.
