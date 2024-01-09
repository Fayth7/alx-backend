#!/usr/bin/env python3
"""
Flask app with Babel extension
"""

from flask import Flask, render_template, request
from flask_babel import Babel, _

app = Flask(__name__)
babel = Babel(app)


class Config:
    """
    Config class with available languages and Babel settings
    """
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app.config.from_object(Config)


@babel.localeselector
def get_locale():
    """
    Babel locale selector using request.accept_languages
    """
    if 'locale' in request.args:
        forced_locale = request.args.get('locale')
        if forced_locale in app.config['LANGUAGES']:
            return forced_locale

    return request.accept_languages.best_match(app.config['LANGUAGES'])


@app.route('/')
def index():
    """
    Route for the index page
    """
    return render_template('4-index.html', title=_("home_title"),
                           header=_("home_header"),
                           current_locale=str(get_locale()))


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
