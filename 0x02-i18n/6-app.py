#!/usr/bin/env python3
"""
Flask app with Babel extension
"""

from flask import Flask, render_template, request, g
from flask_babel import Babel, _, lazy_gettext

app = Flask(__name__)
babel = Babel(app)

# Mock user table
users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


def get_user(user_id):
    """
    Get user from the mock user table
    """
    return users.get(user_id)


@babel.localeselector
def get_locale():
    """
    Babel locale selector with user's preferred locale priority
    """
    # Check locale from URL parameters
    if 'locale' in request.args:
        forced_locale = request.args.get('locale')
        if forced_locale in app.config['LANGUAGES']:
            return forced_locale

    # Check locale from user settings
    if g.user and 'locale' in g.user:
        user_locale = g.user['locale']
        if user_locale in app.config['LANGUAGES']:
            return user_locale

    # Check locale from request header
    request_header_locale = request.headers.get('Accept-Language')
    if request_header_locale:
        header_locale = request_header_locale.split(',')[0]
        if header_locale in app.config['LANGUAGES']:
            return header_locale

    # Default locale
    return app.config['BABEL_DEFAULT_LOCALE']


@app.before_request
def before_request():
    """
    Execute before all other functions, set the user as a global on flask.g
    """
    user_id = request.args.get('login_as', None)
    g.user = get_user(int(user_id)) if user_id else None


@app.route('/')
def index():
    """
    Route for the index page
    """
    return render_template('6-index.html',
                           logged_in_as=lazy_gettext('logged_in_as'),
                           not_logged_in=lazy_gettext('not_logged_in'))


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
