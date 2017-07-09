# Downloading assignments from the GitHub Classroom

## Install

`npm install -g github-classroom-get`

This will install the script globally and add it to the $PATH.

## Usage

To use this script, you need to [create an access token](https://github.com/settings/tokens) on GitHub. Make sure that the token
has `repo` scope access.

You can then call:

`github-classroom-get --org <org> --user <user> --token <token> --assignment <assignment> [--save]``

This will create a new folder in the local directory named '<assignment>' and it
will download all assignments in there.

If you specify the optional [--save] argument, it will save the organization, user
and token to `credentials.json` file in the current directory. Future calls can
then be made as `github-classroom-get --assignment <assignment>`

## License

The following script is distributed under the [MIT License](http://www.opensource.org/licenses/MIT).
