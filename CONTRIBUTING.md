# Guidelines

## Contributions
Fork the repository  and send your contributions through pull-requests. Don't work on the master branch, but on a **feature branch**. As soon as you have something that can be shown/tested **open a pull-request** to our **development** branch. You will see if it is compliant through our CI, which will tell you on the commit with a checkmark if it passed or not. If it's not passing try to rebase your changes using the development branch of our repository. As long as we don't accept your pull-request, you can commit to your feature branch and they will automatically flow into the pull-request.
It's the same way we do in our core project: https://opendatahub.readthedocs.io/en/latest/contributors.html

## Package management
We expect you to use **npm** as package management tool, so that we can create generic pipelines for CI, testing and production deployment.

## Continuous integration
for each web component we need automatic checks if the minimum requirements are met and will therefore do some basic checks like if the folder you pushed is empty, or if there are no javascript files. Furthermore we will try to run your tests with npm.

For more information write to help@opendatahub.bz.it
